import { Droplets, Activity, Calculator, Layers, Wrench, ShieldCheck, Package } from 'lucide-react';
import { InlineMath } from 'react-katex';
import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import type { Dispatch, SetStateAction } from 'react';

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
                <Droplets className="text-shiraz h-5 w-5" />
                Einpressmörtel &amp; Systembaustoffe im Spannbetonbau
              </h4>
              <p className="text-xs text-text-main/70 mt-1">
                Zementeinpressmörtel nach DIN EN 447 / 445 / 446, Hüllrohrsysteme (DIN EN 523 vs. fib Bulletin 75), Korrosionsschutzfette &amp; Keilverankerungen
              </p>
            </div>
            <span className="self-start sm:self-center px-3 py-1 rounded-full text-xs font-semibold bg-shiraz/10 text-shiraz border border-shiraz/20 whitespace-nowrap">
              DIN EN 447 &amp; fib Bulletin 75
            </span>
          </div>

          {/* Didaktische Einleitung */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 leading-relaxed">
            <div>
              <strong className="text-text-main block mb-1">Die 4 Schutz- und Verbundelemente des Spannglieds:</strong>
              <p>
                Im nachträglichen Verbund und bei unverbundenen Spanngliedern ist der hochfeste Spannstahl extrem 
                korrosionsgefährdet (Gefahr von <strong>Spannungsrisskorrosion / Wasserstoffversprödung</strong>). 
                Die Systembaustoffe bilden eine mehrstufige Barriere: 
                <strong> 1. Einpressmörtel</strong> (chemische Passivierung mit <InlineMath math="\text{pH} \ge 12{,}5" />), 
                <strong> 2. Hüllrohr</strong> (mechanischer Schutz gegen Feuchte und Chloride), 
                <strong> 3. Korrosionsschutzfett/Wachs</strong> (bei Monolitzen) und 
                <strong> 4. Keilverankerungen</strong> aus einsatzgehärtetem Qualitätsstahl.
              </p>
            </div>
            <div>
              <strong className="text-text-main block mb-1">Warum ist Einpressmörtel kein normaler Mörtel?</strong>
              <p>
                Einpressmörtel muss über Entfernungen von bis zu 100 m durch enge Litzenzwischenräume gepresst werden. 
                Er erfordert <strong>extrem hohe Fließfähigkeit</strong> bei gleichzeitig 
                <strong> minimalem Wassergehalt (<InlineMath math="w/z \le 0{,}35 - 0{,}40" />)</strong>, 
                darf <strong>kein freies Wasser absondern (Bluten <InlineMath math="\le 0{,}3\,\%" />)</strong> und muss durch 
                spezielle Quellmittel das plastische Schwinden vollständig kompensieren.
              </p>
            </div>
          </div>

          {/* 1. INTERAKTIVES MÖRTEL-LABOR: REZEPTUR & GÜTE NACH DIN EN 447 */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Activity size={14} className="text-shiraz" />
                Mörtel-Labor &amp; Gütesimulation nach DIN EN 447 / DIN EN 445
              </span>
              <span className="text-[11px] font-mono text-slate-500">
                Prüfung bei 20 °C Normtemperatur
              </span>
            </div>

            {/* Steuerregler: w/z-Wert, Zusatzmittel, Zement */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              {/* w/z-Wert */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-text-main">
                  <span>Wasserzementwert (w/z):</span>
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
                  onChange={(e) => setGroutWz(Number(e.target.value))}
                  className="w-full accent-shiraz cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>0,30 (sehr zäh)</span>
                  <span className="text-emerald-700 font-bold">0,36 (Optimum)</span>
                  <span className="text-rose-600 font-bold">0,44 (Grenze DIN EN 447 prüfen)</span>
                  <span>0,45 (Bluten!)</span>
                </div>
              </div>

              {/* Einpresshilfe / Zusatzmittel */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-text-main">
                  <span>Einpresshilfe (DIN EN 934-4):</span>
                  <span className="font-mono text-shiraz font-bold">{formatDeZahl(groutAdmixturePct, 1)} % v. Zement</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="2.0"
                  step="0.1"
                  value={groutAdmixturePct}
                  onChange={(e) => setGroutAdmixturePct(Number(e.target.value))}
                  className="w-full accent-shiraz cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>0,2 % (Gering)</span>
                  <span className="text-shiraz font-bold">1,0 % (Standard)</span>
                  <span>2,0 % (Stark quellend)</span>
                </div>
              </div>

              {/* Zementart */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-main block">
                  Bindemittel (DIN EN 197-1):
                </label>
                <select aria-label="Bindemittel (DIN EN 197-1)"
                  value={groutCementType}
                  onChange={(e) => setGroutCementType(e.target.value)}
                  className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2 font-medium outline-none focus:border-shiraz"
                >
                  <option value="CEM I 52.5 R (C3A-arm)">CEM I 52.5 R (C3A-arm, hochfest)</option>
                  <option value="CEM I 42.5 N (Standard)">CEM I 42.5 N (Standard-Portlandzement)</option>
                  <option value="Werktrockenmörtel (Zugelassen)">Werkstrockenmörtel (werksgemischt nach EAD)</option>
                </select>
                <p className="text-[10px] text-slate-500">Chloridgehalt strikt ≤ 0,10 M-%</p>
              </div>
            </div>

            {/* 4 Soll-Ist KPI Karten nach DIN EN 447 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
              {/* 1. Fließmaß / Trichter */}
              <div className={`p-3 rounded-xl border space-y-1 ${
                  groutCalculations.flowValid ? 'bg-white border-home-grau/30' : 'bg-rose-50 border-rose-200'
                }`}>
                <div className="flex items-center justify-between text-xs text-text-main/70">
                  <span className="font-semibold uppercase tracking-wider">Fließvermögen (Trichterverfahren DIN EN 445)</span>
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
                    <span>Normbereich t₀:</span>
                    <strong className="font-mono">t₀, t₃₀ ≤ 25 s</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Nach 30 min (t₃₀):</span>
                    <strong className="font-mono">{formatDeWert(groutCalculations.flowTimeT30)} s (max. 28 s)</strong>
                  </div>
                </div>
              </div>

              {/* 2. Wasserabsondern (Bluten) */}
              <div className={`p-3 rounded-xl border space-y-1 ${
                  groutCalculations.bleedingValid ? 'bg-white border-home-grau/30' : 'bg-rose-50 border-rose-200'
                }`}>
                <div className="flex items-center justify-between text-xs text-text-main/70">
                  <span className="font-semibold uppercase tracking-wider">Wasserabsondern (3 h)</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                      groutCalculations.bleedingValid ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                    {groutCalculations.bleedingValid ? 'Normkonform' : 'Gefahr Bluten!'}
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
                    <span>Grenzwert DIN EN 447:</span>
                    <strong className="font-mono">≤ 0,30 %</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Wiederaufnahme 24 h:</span>
                    <strong className="font-mono text-emerald-700">100 % (Vollständig)</strong>
                  </div>
                </div>
              </div>

              {/* 3. Volumenänderung (Quellen) */}
              <div className={`p-3 rounded-xl border space-y-1 ${
                  groutCalculations.expansionValid ? 'bg-white border-home-grau/30' : 'bg-amber-50 border-amber-200'
                }`}>
                <div className="flex items-center justify-between text-xs text-text-main/70">
                  <span className="font-semibold uppercase tracking-wider">Volumenänderung (24 h)</span>
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
                    <strong className="font-mono">−1 % bis +5 %</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Wirkung Quellmittel:</span>
                    <span className="text-[10px] text-slate-500">Keine Schwindsäcke</span>
                  </div>
                </div>
              </div>

              {/* 4. Druckfestigkeit & Passivierung */}
              <div className="p-3 rounded-xl bg-white border border-home-grau/30 space-y-1">
                <div className="flex items-center justify-between text-xs text-text-main/70">
                  <span className="font-semibold uppercase tracking-wider">Druckfestigkeit / pH</span>
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
                    <span>Nach 7 Tagen (fc,7):</span>
                    <strong className="font-mono">{formatDeWert(groutCalculations.fc7d)} MPa (≥ 27)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Alkalische Passivierung:</span>
                    <strong className="font-mono text-emerald-700">pH 12.8 ≥ 12,5</strong>
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
                  <Calculator className="text-shiraz h-4 w-4" />
                  Injektions- &amp; Materialmengen-Rechner für Spannglieder
                </h5>
                <p className="text-[11px] text-text-main/70">
                  Berechnung von Netto-Hohlraumvolumen, Zement-, Wasser- und Zusatzmittelbedarf je Spannglied
                </p>
              </div>
              <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                Länge: {formatDeWert(groutTendonLength)} m | {groutStrandCount} Litzen 150 mm²
              </span>
            </div>

            {/* Steuerregler: Spanngliedlänge, Litzenanzahl, Hüllrohr-Durchmesser */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-text-main">
                  <span>Spanngliedlänge (L):</span>
                  <span className="font-mono text-shiraz font-bold">{formatDeWert(groutTendonLength)} m</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="120"
                  step="5"
                  value={groutTendonLength}
                  onChange={(e) => setGroutTendonLength(Number(e.target.value))}
                  className="w-full accent-shiraz cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>10 m</span>
                  <span>45 m (Standard)</span>
                  <span>120 m (Großbrücke)</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-text-main">
                  <span>Litzenbelegung (Ap = {groutStrandCount * 150} mm²):</span>
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
                  <span>Hüllrohr-Innendurchmesser (Di):</span>
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
                <span className="text-[10px] text-slate-500">Freier Hohlquerschnitt – zzgl. 10–20 % für Entlüftung, Leitungen und Überlauf</span>
              </div>

              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Zementbedarf</span>
                <span className="text-xl font-bold font-mono text-shiraz">{formatDeWert(groutCalculations.totalCementKg)} kg</span>
                <span className="text-[10px] text-slate-500">ca. {formatDeWert(groutCalculations.cementBags25)} Säcke à 25 kg</span>
              </div>

              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Wasserbedarf (w/z = {formatDeWert(groutWz)})</span>
                <span className="text-xl font-bold font-mono text-blue-700">{formatDeWert(groutCalculations.totalWaterLiter)} Liter</span>
                <span className="text-[10px] text-slate-500">Trinkwasserqualität</span>
              </div>

              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Einpresshilfe ({formatDeWert(groutAdmixturePct)} %)</span>
                <span className="text-xl font-bold font-mono text-purple-700">{formatDeWert(groutCalculations.totalAdmixtureKg)} kg</span>
                <span className="text-[10px] text-slate-500">Quell- &amp; Fließmittel</span>
              </div>
            </div>

            {/* Technische Einpress-Richtwerte */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-amber-50/60 p-3 rounded-xl border border-amber-200 text-amber-950">
              <div>
                <strong>Einpressgeschwindigkeit:</strong>
                <p className="text-[11px] text-amber-900 mt-0.5">
                  <strong>5 – 15 m/min</strong> (kontinuierlich, um Lufteinschlüsse laminar voranzuschieben).
                </p>
              </div>
              <div>
                <strong>Maximaler Einpressdruck:</strong>
                <p className="text-[11px] text-amber-900 mt-0.5">
                  <strong>p ≤ 10 – 15 bar</strong> an der Presse; Nachdrücken mit <strong>5 bar für 1–2 min</strong>.
                </p>
              </div>
              <div>
                <strong>Entlüftungsstellen:</strong>
                <p className="text-[11px] text-amber-900 mt-0.5">
                  An allen Scheitelpunkten (Hochpunkten) sowie alle <strong>≤ 30 m</strong> Entlüftungsrohre setzen!
                </p>
              </div>
            </div>
          </div>

          {/* 3. HÜLLROHRSYSTEME IM DIREKTVERGLEICH: STAHL VS. KUNSTSTOFF */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-home-grau/15 pb-2">
              <h5 className="font-bold text-sm text-text-main flex items-center gap-2">
                <Layers className="text-shiraz h-4 w-4" />
                Hüllrohr-Systemvergleich: Stahlwellblech (DIN EN 523) vs. Kunststoff-Wellrohr (fib Bulletin 75)
              </h5>
              <span className="text-[11px] text-slate-500">fib Category PL1, PL2 &amp; PL3</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-text-main border-b border-home-grau/30 font-semibold">
                    <th className="p-2.5">Eigenschaft</th>
                    <th className="p-2.5">Stahlwellrohr (DIN EN 523 / fib PL1)</th>
                    <th className="p-2.5 text-shiraz">Kunststoff-Wellrohr (HDPE/PP / fib PL2 &amp; PL3)</th>
                    <th className="p-2.5">Praxis-Auswirkung im Spannbeton</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-home-grau/20 text-text-main/80">
                  <tr className="hover:bg-off-white">
                    <td className="p-2.5 font-bold">Werkstoff &amp; Wanddicke</td>
                    <td className="p-2.5">Gefalztes, verzinktes Bandstahl (t ≈ 0,35–0,50 mm)</td>
                    <td className="p-2.5 font-semibold text-shiraz">Extrudiertes High-Density Polyethylen (HDPE / PP, t ≥ 2,0 mm)</td>
                    <td className="p-2.5 text-[11px]">Kunststoffrohre sind extrem schlagzäh und knicksicher.</td>
                  </tr>
                  <tr className="hover:bg-off-white">
                    <td className="p-2.5 font-bold">Reibungsbeiwert μ</td>
                    <td className="p-2.5 font-mono">0,18 – 0,22</td>
                    <td className="p-2.5 font-mono font-bold text-shiraz">0,12 – 0,14 (-35 %)</td>
                    <td className="p-2.5 text-[11px]">Erheblich geringere Reibungsverluste ΔP(μ) beim Spannen!</td>
                  </tr>
                  <tr className="hover:bg-off-white">
                    <td className="p-2.5 font-bold">Ungewollte Krümmung (Wobble k)</td>
                    <td className="p-2.5 font-mono">0,005 – 0,010 rad/m</td>
                    <td className="p-2.5 font-mono text-shiraz">0,004 – 0,007 rad/m</td>
                    <td className="p-2.5 text-[11px]">Steifere Geometrie verringert Wellenbildung beim Betonieren.</td>
                  </tr>
                  <tr className="hover:bg-off-white">
                    <td className="p-2.5 font-bold">Korrosionsschutzbarriere</td>
                    <td className="p-2.5">Verzinkung opfert sich; Rost bei Wassereintritt</td>
                    <td className="p-2.5 font-semibold text-emerald-700">sehr dicht gegen Chloride und Feuchte</td>
                    <td className="p-2.5 text-[11px]">Vollständige Kapselung des Spannstahls vor Tausalzen.</td>
                  </tr>
                  <tr className="hover:bg-off-white">
                    <td className="p-2.5 font-bold">Elektrische Isolierung (EIT)</td>
                    <td className="p-2.5 text-slate-500">Nicht möglich (leitfähig mit Beton)</td>
                    <td className="p-2.5 font-semibold text-emerald-700">Ja (Electrically Isolated Tendon, R ≥ 1 MΩ·m)</td>
                    <td className="p-2.5 text-[11px]">Ermöglicht zerstörungsfreie Dichtigkeits- &amp; Korrosionsüberwachung über Lebensdauer.</td>
                  </tr>
                  <tr className="hover:bg-off-white">
                    <td className="p-2.5 font-bold">Verschleiß bei Umlenkung</td>
                    <td className="p-2.5">Gefahr des Durchscheuerns bei hoher Pressung</td>
                    <td className="p-2.5 font-semibold text-shiraz">Sehr hohe Ermüdungs- und Abriebfestigkeit</td>
                    <td className="p-2.5 text-[11px]">Kein metallischer Reibkontakt Spanndraht / Hüllrohr.</td>
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
                <Wrench className="h-4 w-4 text-shiraz" />
                1. Spannkeile &amp; Ankerkörper
              </h5>
              <p className="text-xs text-text-main/80 leading-relaxed">
                Die Verankerung hochfester Litzen (<InlineMath math="f_{pk} = 1860\text{ MPa}" />) stellt extreme Werkstoffanforderungen:
              </p>
              <ul className="list-disc pl-4 space-y-1 text-xs text-text-main/80">
                <li><strong>Einsatzgehärteter Sonderstahl:</strong> Z. B. 16MnCr5 mit <strong>Randschichthärte 58–62 HRC</strong> (krallt sich sicher in die Litzen) und <strong>zäh-elastischem Kern (ca. 35 HRC)</strong> gegen Sprödbruch.</li>
                <li><strong>Mehrteilige Keile:</strong> 2-teilig oder 3-teilig mit elastischem Federring zur symmetrischen Krafteinleitung.</li>
                <li><strong>Ankerplatten:</strong> Sphäroguss <strong>EN-GJS-400-15</strong> oder Schmiedestahl zur optimalen Lastverteilung in die Teilflächenzone.</li>
              </ul>
            </div>

            {/* Box 2: Korrosionsschutzfette für Monolitzen */}
            <div className="p-4 rounded-xl bg-off-white border border-home-grau/30 space-y-2">
              <h5 className="font-bold text-xs uppercase tracking-wider text-text-main flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-shiraz" />
                2. Korrosionsschutzfette &amp; Monolitzen
              </h5>
              <p className="text-xs text-text-main/80 leading-relaxed">
                Bei der <strong>Vorspannung ohne Verbund</strong> (z. B. Flachdecken im Hochbau) gleiten Monolitzen in einer PE-Hülle:
              </p>
              <ul className="list-disc pl-4 space-y-1 text-xs text-text-main/80">
                <li><strong>Spezialfett / Schutzwachs:</strong> Verseifungsfreie Kohlenwasserstofffette mit Korrosionsinhibitoren (<InlineMath math="\ge 45\,\text{g/m}" />).</li>
                <li><strong>Temperaturbeständigkeit:</strong> Tropfpunkt <InlineMath math="\ge 85 - 100^{\circ}\text{C}" />, kälteflexibel bis -20 °C, keine Verharzung.</li>
                <li><strong>PE-Schutzmantel:</strong> Nahtlos extrudiertes Polyethylen hoher Dichte (HDPE, Mindestwandstärke <InlineMath math="t \ge 1{,}0\,\text{mm}" />).</li>
                <li><strong>Reibungsbeiwert:</strong> Extrem gering (<InlineMath math="\mu \approx 0{,}05 - 0{,}06" />).</li>
              </ul>
            </div>

            {/* Box 3: Dichtungskappen & Entlüfter */}
            <div className="p-4 rounded-xl bg-off-white border border-home-grau/30 space-y-2">
              <h5 className="font-bold text-xs uppercase tracking-wider text-text-main flex items-center gap-1.5">
                <Package className="h-4 w-4 text-shiraz" />
                3. Dichtungskappen &amp; Prüfstutzen
              </h5>
              <p className="text-xs text-text-main/80 leading-relaxed">
                Dauerhafter Schutz der Verankerungs- und Entlüftungsstellen:
              </p>
              <ul className="list-disc pl-4 space-y-1 text-xs text-text-main/80">
                <li><strong>Permanente Ankerkappen:</strong> Druckfeste Schutzkappen aus PE oder korrosionsgeschütztem Guss mit O-Ring-Dichtung.</li>
                <li><strong>Entlüftungsstutzen:</strong> Transparente PE-Schläuche an allen Hochpunkten zur optischen Kontrolle des blasenfreien Mörtelaustritts.</li>
                <li><strong>Verschluss:</strong> Nach dem Abbinden werden Entlüfter bündig abgeschnitten und luft- und wasserdicht versiegelt.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
}
