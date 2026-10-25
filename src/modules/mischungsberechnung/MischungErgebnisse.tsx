import type { Hinweis } from '@/src/calc/plausibilitaet';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { CheckCircle2, AlertTriangle } from 'lucide-react';
import { formatDeZahl, formatDeWert, formatDeTeX } from '@/src/utils/numberFormat';
import { EingabeHinweise } from '@/src/components/ui/EingabeHinweise';
import { InfoTooltip } from '@/src/components/ui/InfoTooltip';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { zementData } from './daten';
import { Pie, Line } from 'react-chartjs-2';
import React from 'react';
import { NachErstemBild } from '@/src/components/ui/NachErstemBild';

interface MischungErgebnisseProps {
  betonMengeL: number;
  biochar: number;
  dmax: 8 | 16 | 32;
  expClasses: string[];
  fa: number;
  feuchte04: number;
  feuchte1632: number;
  feuchte48: number;
  feuchte816: number;
  feuchteBiochar: number;
  hues: number;
  lineChartData: { labels: number[]; datasets: ({ label: string; data: number[]; borderColor: string; borderWidth: number; fill: boolean; tension: number; borderDash?: undefined; } | { label: string; data: number[]; borderColor: string; borderDash: number[]; fill: boolean; tension: number; borderWidth?: undefined; })[]; };
  luft: number;
  pieChartData: { labels: string[]; datasets: { data: number[]; backgroundColor: string[]; }[]; };
  ppFaser: number;
  results: { wasserTrocken: number; zugabewasser: number; wasserAusGestein: number; wasserAusBiochar: number; volZement: number; volFa: number; volSf: number; volKsm: number; volBiochar: number; volZM: number; volLuft: number; volGestein: number; volStahlfaser: number; volPpFaser: number; volFasernGesamt: number; masseGesteinTrocken: number; m04_tr: number; m48_tr: number; m816_tr: number; m1632_tr: number; m04_feucht: number; m48_feucht: number; m816_feucht: number; m1632_feucht: number; biochar_feucht: number; frischbetonRohdichte: number; wz: number; wzEq: number; wbWert: number; volLeim: number; co2Zement: number; co2Fa: number; co2Sf: number; co2Ksm: number; co2Biochar: number; co2Gestein: number; co2Wasser: number; co2ZM: number; co2Stahlfaser: number; co2PpFaser: number; co2FasernGesamt: number; co2Gesamt: number; reqMaxWz: number; reqMinZ: number; reqMinC: string; reqMinCover: number; reqMaxZement: number; isWzOk: boolean; xf4OhneLp: boolean; isZOk: boolean; isMaxZOk: boolean; radarChartData: { labels: string[]; datasets: { label: string; data: number[]; backgroundColor: string; borderColor: string; borderWidth: number; pointBackgroundColor: string; }[]; }; estimatedWater: number; maxFa: number; anrechenbarFa: number; maxSf: number; anrechenbarSf: number; mehlkornAusSand: number; mehlkornGesamt: number; maxMehlkornText: string; isMehlkornOk: boolean; hasXFoderXM: boolean; lpWaterReduction: number; isLpActive: boolean; hinweise: Hinweis[]; };
  rhoGestein: number;
  setBetonMengeL: React.Dispatch<React.SetStateAction<number>>;
  sf: number;
  stahlfaser: number;
  zement: number;
  zementArt: string;
  zementFestigkeit: string;
  zusatzmittel: number;
}

export default function MischungErgebnisse({ betonMengeL, biochar, dmax, expClasses, fa, feuchte04, feuchte1632, feuchte48, feuchte816, feuchteBiochar, hues, lineChartData, luft, pieChartData, ppFaser, results, rhoGestein, setBetonMengeL, sf, stahlfaser, zement, zementArt, zementFestigkeit, zusatzmittel }: MischungErgebnisseProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="bg-shiraz text-white p-6 rounded-xl shadow-md">
        <h3 className="text-sm font-bold uppercase tracking-wider mb-4 opacity-90"><FormulaText text="Ergebnisse (pro m³ Beton)" /></h3>

        {/* Prüfungen */}
        {expClasses.length > 0 && (
          <div className="mb-6 space-y-2">
            <div className={`p-3 rounded flex items-center gap-3 ${results.isWzOk ? 'bg-green-500/20 text-green-100' : 'bg-red-500/20 text-red-100'}`}>
              {results.isWzOk ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />}
              <div>
                <div className="font-bold text-sm">w/z-Wert Prüfung</div>
                <div className="text-xs opacity-80">Ist: {formatDeZahl(results.wzEq, 2)} | Max: {formatDeZahl(results.reqMaxWz, 2)}</div>
              </div>
            </div>
            <div className={`p-3 rounded flex items-center gap-3 ${results.isZOk ? 'bg-green-500/20 text-green-100' : 'bg-red-500/20 text-red-100'}`}>
              {results.isZOk ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />}
              <div>
                <div className="font-bold text-sm">Zementgehalt Prüfung</div>
                <div className="text-xs opacity-80">Ist: {formatDeWert(zement)} kg | Min: {formatDeWert(results.reqMinZ)} kg</div>
              </div>
            </div>
          </div>
        )}

        {/* Mehlkornprüfung nur anzeigen, wenn XF oder XM gewählt ist */}
        {results.hasXFoderXM && (
          <div className="mb-6 space-y-2">
            <div className={`p-3 rounded flex items-center gap-3 border ${results.isMehlkornOk ? 'bg-white/10 text-white border-white/20' : 'bg-rose-500/20 text-rose-100 border-rose-400/40'}`}>
              {results.isMehlkornOk ? (
                <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
              ) : (
                <AlertTriangle size={20} className="text-rose-400 shrink-0" />
              )}
              <div>
                <div className="font-bold text-sm">Mehlkorngehalt Prüfung (≤ 0,125 mm)</div>
                <div className="text-xs opacity-90">
                  Ist: {formatDeZahl(results.mehlkornGesamt, 0)} kg/m³ | Zulässig: {results.maxMehlkornText}
                  {!results.isMehlkornOk && ' (Grenzwert überschritten!)'}
                </div>
              </div>
            </div>
          </div>
        )}

        <EingabeHinweise hinweise={results.hinweise.filter(x => x.feld !== 'fraktionen')} />
        <div className="grid grid-cols-2 gap-y-6 gap-x-4">
          <div>
            <div className="text-white/70 text-sm">Zugabewasser</div>
            <div className="text-2xl font-bold">{formatDeZahl(results.zugabewasser, 1)} Liter</div>
            <div className="text-xs text-white/50 mt-1">({formatDeZahl(results.wasserAusGestein, 1)} L aus Gestein{biochar > 0 ? `, ${formatDeZahl(results.wasserAusBiochar, 1)} L aus Biochar` : ''})</div>
          </div>
          <div>
            <div className="text-white/70 text-sm">Leimvolumen</div>
            <div className="text-2xl font-bold"><FormulaText text={`${formatDeTeX(results.volLeim, 1)} \\text{ dm}^3`} /></div>
          </div>
          <div>
            <div className="text-white/70 text-sm flex items-center gap-1">
              w/z-Wert
            </div>
            <div className="text-2xl font-bold">{formatDeZahl(results.wz, 2)}</div>
          </div>
          <div>
            <div className="text-white/70 text-sm flex items-center gap-1">
              Äquivalenter (w/z)eq
            </div>
            <div className="text-2xl font-bold">{formatDeZahl(results.wzEq, 2)}</div>
          </div>
          <div>
            <div className="text-white/70 text-sm flex items-center gap-1">
              w/b-Wert
              <InfoTooltip text="Wasser-Bindemittel-Wert (reines Massenverhältnis ohne k-Faktoren)" />
            </div>
            <div className="text-2xl font-bold">{formatDeZahl(results.wbWert, 2)}</div>
          </div>
          <div>
            <div className="text-white/70 text-sm flex items-center gap-1">
              Frischbetonrohdichte
            </div>
            <div className="text-2xl font-bold"><FormulaText text={`${formatDeTeX((results.frischbetonRohdichte * 1000), 0)} \\text{ kg/m}^3`} /></div>
          </div>
          <div>
            <div className="text-white/70 text-sm flex items-center gap-1">
              Luftporenvolumen (LP)
              <InfoTooltip text="Künstlich eingetragenes oder verbleibendes Luftporenvolumen im Beton." />
            </div>
            <div className="text-2xl font-bold">{formatDeZahl(results.volLuft, 1)} dm³</div>
            <div className="text-xs text-white/50 mt-1">({formatDeZahl(luft, 1)} Vol.-% der Mischung)</div>
          </div>
          <div>
            <div className="text-white/70 text-sm flex items-center gap-1">
              Gesteinsvolumen
              <InfoTooltip text="Das rechnerische Restvolumen für die Gesteinskörnung." />
            </div>
            <div className="text-2xl font-bold"><FormulaText text={`${formatDeTeX(results.volGestein, 1)} \\text{ dm}^3`} /></div>
            <div className="text-xs text-white/50 mt-1">({formatDeZahl((results.volGestein / 10), 1)} Vol.-% der Mischung)</div>
          </div>
        </div>

        {/* Detaillierte Live-Rechnung (Stoffraumrechnung) */}
        <div className="mt-6 pt-4 border-t border-white/20">
          <h4 className="text-xs font-bold uppercase tracking-wider mb-2 opacity-90 text-yellow-300">Live-Stoffraumrechnung (Volumenbilanz):</h4>
          <div className="bg-white/10 p-3 rounded-lg text-xs font-mono space-y-2 text-white">
            <div className="flex justify-between items-center text-white/90 border-b border-white/10 pb-1.5 font-bold">
              <span>1000 dm³ = V_Gestein + V_Zement + V_Wasser + V_Stoffe + V_ZM + V_Luft + V_Fasern</span>
            </div>
            <div className="space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span>V_Zement:</span> <span>{formatDeZahl(results.volZement, 1)} dm³</span>
              </div>
              <div className="flex justify-between">
                <span>V_Wasser (trocken):</span> <span>{formatDeZahl((results.wasserTrocken / 1.0), 1)} dm³</span>
              </div>
              {(results.volFa + results.volSf + results.volKsm + results.volBiochar) > 0 && (
                <div className="flex justify-between">
                  <span>V_Zusatzstoffe:</span> <span>{formatDeZahl((results.volFa + results.volSf + results.volKsm + results.volBiochar), 1)} dm³</span>
                </div>
              )}
              {results.volZM > 0 && (
                <div className="flex justify-between">
                  <span>V_Zusatzmittel:</span> <span>{formatDeZahl(results.volZM, 1)} dm³</span>
                </div>
              )}
              {results.volFasernGesamt > 0 && (
                <div className="flex justify-between text-yellow-200 font-semibold">
                  <span>V_Fasern (SF: {formatDeZahl(results.volStahlfaser, 2)} dm³, PP: {formatDeZahl(results.volPpFaser, 2)} dm³):</span> <span>{formatDeZahl(results.volFasernGesamt, 2)} dm³</span>
                </div>
              )}
              <div className="flex justify-between text-yellow-300 font-semibold border-b border-white/10 pb-1">
                <span>V_Luftporen (Luftgehalt):</span> <span>{formatDeZahl(results.volLuft, 1)} dm³ ({formatDeZahl(luft, 1)} Vol.-%)</span>
              </div>
              <div className="flex justify-between pt-1 font-bold text-green-300">
                <span>Restvolumen V_Gestein:</span> <span>{formatDeZahl(results.volGestein, 1)} dm³</span>
              </div>
            </div>
          </div>
          <div className="text-[10px] text-white/75 mt-2 leading-normal">
            Berechnungsformel: <span className="italic font-serif">V_Gestein = 1000 - (V_Zement + V_Wasser + V_Zusatzstoffe + V_Zusatzmittel + V_Luft + V_Fasern)</span>
          </div>
        </div>
      </div>

      <NachErstemBild minHoehe="30rem">
      {/* Live-Rechenweg (AP 3.7): Stoffraumrechnung mit den aktuellen Eingaben */}
      <FormulaDerivationBox
        live
        title="Ihr Rechenweg: Stoffraumrechnung für 1 m³ Beton"
        zielGleichung="V_G = 1000 - \left(\frac{z}{\rho_z} + \frac{w}{\rho_w} + \sum \frac{m_i}{\rho_i} + 10 \cdot p\right)"
        schritte={[
          {
            titel: 'Zementvolumen',
            erklaerung: `${zementArt} mit der Reindichte ρ_z = ${formatDeZahl(zementData[zementArt].rho, 2)} kg/dm³:`,
            formel: `V_z = \\frac{${formatDeTeX(zement, 0)}}{${formatDeTeX(zementData[zementArt].rho, 2)}} = ${formatDeTeX(results.volZement, 1)}\\,\\text{dm}^3`
          },
          {
            titel: 'Wasser, Zusatzstoffe, Zusatzmittel, Fasern und Luft',
            erklaerung: `Wasser mit ρ_w = 1,0 kg/dm³, Luftgehalt ${formatDeZahl(luft, 1)} Vol.-% entspricht ${formatDeZahl(results.volLuft, 0)} dm³:`,
            formel: `V_w + V_{ZS} + V_{ZM} + V_F + V_L = ${formatDeTeX(results.wasserTrocken, 1)} + ${formatDeTeX(results.volFa + results.volSf + results.volKsm + results.volBiochar, 1)} + ${formatDeTeX(results.volZM, 1)} + ${formatDeTeX(results.volFasernGesamt, 1)} + ${formatDeTeX(results.volLuft, 1)}\\,\\text{dm}^3`
          },
          {
            titel: 'Stoffraum der Gesteinskörnung',
            erklaerung: 'Der Rest bis 1000 dm³ steht für die Gesteinskörnung zur Verfügung:',
            formel: `V_G = 1000 - ${formatDeTeX(1000 - results.volGestein, 1)} = ${formatDeTeX(results.volGestein, 1)}\\,\\text{dm}^3`
          },
          {
            titel: 'Masse der Gesteinskörnung (trocken)',
            erklaerung: `Mit der Kornrohdichte ρ_G = ${formatDeZahl(rhoGestein, 2)} kg/dm³:`,
            formel: `m_G = ${formatDeTeX(results.volGestein, 1)} \\cdot ${formatDeTeX(rhoGestein, 2)} = ${formatDeTeX(results.masseGesteinTrocken, 0)}\\,\\text{kg}`
          },
          {
            titel: 'Frischbetonrohdichte',
            erklaerung: 'Summe aller Ausgangsstoffmassen je m³:',
            formel: `\\rho_{fb} = ${formatDeTeX(zement + results.wasserTrocken + fa + sf + hues + biochar + zusatzmittel + stahlfaser + ppFaser, 0)} + ${formatDeTeX(results.masseGesteinTrocken, 0)} = ${formatDeTeX(results.frischbetonRohdichte * 1000, 0)}\\,\\text{kg/m}^3`
          }
        ]}
        ergebnisHinweis="Die Aufteilung auf die Kornfraktionen und die Korrektur der Eigenfeuchte folgen in der Dosiertabelle."
        normQuelle="DIN EN 206:2021-06; DIN 1045-2:2023-08"
      />

      {/* CO2 Box */}
      <div className="bg-green-50 border border-green-200 p-6 rounded-xl shadow-sm">
        <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-green-800"><FormulaText text="CO_2-Fußabdruck (GWP)" /></h3>
        <div className="text-3xl font-bold text-green-700"><FormulaText text={`${formatDeTeX(results.co2Gesamt, 0)} \\text{ kg CO}_2\\text{-Äq.}`} /></div>
        <div className="text-sm text-green-600 mb-4"><FormulaText text="pro m³ Beton" /></div>

        <div className="grid grid-cols-2 gap-2 text-sm text-green-800/80">
          <div className="flex justify-between border-b border-green-200/50 pb-1">
            <span>Zement ({zementArt}):</span> <span className="font-medium">{formatDeZahl(results.co2Zement, 1)} kg</span>
          </div>
          <div className="flex justify-between border-b border-green-200/50 pb-1">
            <span>Gestein:</span> <span className="font-medium">{formatDeZahl(results.co2Gestein, 1)} kg</span>
          </div>
          {(fa > 0 || sf > 0 || hues > 0 || biochar > 0) && (
            <div className="flex justify-between border-b border-green-200/50 pb-1">
              <span>Zusatzstoffe:</span> <span className="font-medium">{formatDeZahl((results.co2Fa + results.co2Sf + results.co2Ksm + results.co2Biochar), 1)} kg</span>
            </div>
          )}
          {results.co2FasernGesamt > 0 && (
            <div className="flex justify-between border-b border-green-200/50 pb-1">
              <span>Fasern (SF/PP):</span> <span className="font-medium">{formatDeZahl(results.co2FasernGesamt, 1)} kg</span>
            </div>
          )}
          {zusatzmittel > 0 && (
            <div className="flex justify-between border-b border-green-200/50 pb-1">
              <span>Zusatzmittel:</span> <span className="font-medium">{formatDeZahl(results.co2ZM, 1)} kg</span>
            </div>
          )}
          <div className="flex justify-between border-b border-green-200/50 pb-1">
            <span>Wasser:</span> <span className="font-medium">{formatDeZahl(results.co2Wasser, 1)} kg</span>
          </div>
        </div>
      </div>
      </NachErstemBild>

      <NachErstemBild minHoehe="30rem">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h3 className="font-semibold mb-4 text-text-main"><FormulaText text="Volumenanteile (\text{dm}^3/\text{m}^3)" /></h3>
        <div className="h-[250px] mb-6">
          <Pie data={pieChartData} options={{ maintainAspectRatio: false }} />
        </div>

        {/* Schematische Darstellung des 1m³ Würfels */}
        <div className="mt-8">
          <h4 className="text-sm font-semibold text-text-main mb-2">Schematischer 1m³ Block</h4>
          <div className="w-full h-16 rounded-lg overflow-hidden flex border border-home-grau/30">
            <div 
              style={{ width: `${(results.volGestein / 1000) * 100}%` }} 
              className="bg-stone-400 flex items-center justify-center text-xs text-white font-medium"
              title={`Gestein: ${formatDeZahl(results.volGestein, 1)} dm³`}
            >
              {results.volGestein > 100 && 'Gestein'}
            </div>
            <div 
              style={{ width: `${((results.volZement + results.volFa + results.volSf + results.volKsm + results.volBiochar) / 1000) * 100}%` }} 
              className="bg-slate-400 flex items-center justify-center text-xs text-white font-medium"
              title={`Bindemittel: ${formatDeZahl((results.volZement + results.volFa + results.volSf + results.volKsm + results.volBiochar), 1)} dm³`}
            >
              {(results.volZement + results.volFa + results.volSf + results.volKsm + results.volBiochar) > 100 && 'Bindemittel'}
            </div>
            <div 
              style={{ width: `${(results.wasserTrocken / 1000) * 100}%` }} 
              className="bg-blue-400 flex items-center justify-center text-xs text-white font-medium"
              title={`Wasser: ${formatDeZahl(results.wasserTrocken, 1)} dm³`}
            >
              {results.wasserTrocken > 50 && 'Wasser'}
            </div>
            {results.volFasernGesamt > 0 && (
              <div 
                style={{ width: `${(results.volFasernGesamt / 1000) * 100}%` }} 
                className="bg-shiraz flex items-center justify-center text-[10px] text-white font-bold"
                title={`Fasern (Stahl/PP): ${formatDeZahl(results.volFasernGesamt, 2)} dm³`}
              >
                {results.volFasernGesamt > 3 && 'Fasern'}
              </div>
            )}
            <div 
              style={{ width: `${(results.volLuft / 1000) * 100}%` }} 
              className="bg-sky-200 flex items-center justify-center text-xs text-sky-800 font-medium"
              title={`Luft: ${formatDeZahl(results.volLuft, 1)} dm³`}
            >
              {results.volLuft > 30 && 'Luft'}
            </div>
          </div>
          <div className="flex justify-between text-xs text-text-main/60 mt-1">
            <span>0 dm³</span>
            <span>1000 dm³</span>
          </div>
        </div>
      </div>

      {/* Sieblinien Chart */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h3 className="font-semibold mb-4 text-text-main flex items-center gap-2">
          Sieblinie (Dmax = {dmax} mm)
          <InfoTooltip text="Vergleich der aktuellen Gesteinszusammensetzung mit den Regelsieblinien A, B und C nach DIN 1045-2." />
        </h3>
        <div className="h-[300px]">
          <Line 
            data={lineChartData} 
            options={{ 
              maintainAspectRatio: false,
              scales: {
                y: { min: 0, max: 100, title: { display: true, text: 'Siebdurchgang in M.-%' } },
                x: { 
                  type: 'logarithmic', 
                  title: { display: true, text: 'Siebweite in mm' },
                  min: 0.125,
                  max: dmax,
                  ticks: {
                    callback: function(value) {
                      if (value === 0.125) return '0';
                      return value;
                    }
                  }
                }
              }
            }} 
          />
        </div>
      </div>
      </NachErstemBild>

      <NachErstemBild minHoehe="30rem">
      {/* Detail-Tabelle Rezeptur */}
      <div className="bg-off-white p-5 rounded-xl border border-home-grau/30 overflow-x-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
          <h3 className="font-semibold text-text-main"><FormulaText text="Betonrezeptur" /></h3>
          <div className="flex items-center gap-2 max-w-[250px]">
            <label htmlFor="beton-menge-liter" className="text-sm font-medium text-text-main shrink-0">Für Menge (Liter):</label>
            <input 
              id="beton-menge-liter"
              aria-label="Für Menge in Litern"
              type="number" 
              value={betonMengeL} 
              onChange={(e) => setBetonMengeL(Math.max(1, Number(e.target.value)))} 
              className="w-24 p-1.5 text-sm border border-home-grau/30 rounded bg-white focus:outline-none focus:ring-1 focus:ring-middle-blue/50 text-right" 
              min="1"
            />
          </div>
        </div>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-home-grau/30 align-bottom">
              <th className="pb-2 font-semibold">Komponente</th>
              <th className="pb-2 font-semibold text-right">Masse trocken <br/><span className="text-xs font-normal opacity-70">pro m³ (kg)</span></th>
              <th className="pb-2 font-semibold text-right">Feuchte <br/><span className="text-xs font-normal opacity-70">(%)</span></th>
              <th className="pb-2 font-semibold text-right">Einwaage feucht <br/><span className="text-xs font-normal opacity-70">pro m³ (kg/L)</span></th>
              <th className="pb-2 font-semibold text-right text-shiraz bg-off-white px-2 rounded-t-md">Einwaage feucht <br/><span className="text-xs font-normal opacity-70">für {formatDeWert(betonMengeL)} L (kg/L)</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-home-grau/10">
            <tr>
              <td className="py-2">Zement ({zementArt} {zementFestigkeit})</td>
              <td className="py-2 text-right">{formatDeZahl(zement, 1)}</td>
              <td className="py-2 text-right">-</td>
              <td className="py-2 text-right font-bold">{formatDeZahl(zement, 1)} kg</td>
              <td className="py-2 text-right font-bold text-shiraz bg-off-white px-2">{formatDeZahl((zement * betonMengeL / 1000), 2)} kg</td>
            </tr>
            {fa > 0 && (
              <tr>
                <td className="py-2">Flugasche</td>
                <td className="py-2 text-right">{formatDeZahl(fa, 1)}</td>
                <td className="py-2 text-right">-</td>
                <td className="py-2 text-right font-bold">{formatDeZahl(fa, 1)} kg</td>
                <td className="py-2 text-right font-bold text-shiraz bg-off-white px-2">{formatDeZahl((fa * betonMengeL / 1000), 2)} kg</td>
              </tr>
            )}
            {sf > 0 && (
              <tr>
                <td className="py-2">Silikastaub</td>
                <td className="py-2 text-right">{formatDeZahl(sf, 1)}</td>
                <td className="py-2 text-right">-</td>
                <td className="py-2 text-right font-bold">{formatDeZahl(sf, 1)} kg</td>
                <td className="py-2 text-right font-bold text-shiraz bg-off-white px-2">{formatDeZahl((sf * betonMengeL / 1000), 2)} kg</td>
              </tr>
            )}
            {hues > 0 && (
              <tr>
                <td className="py-2">Hüttensandmehl</td>
                <td className="py-2 text-right">{formatDeZahl(hues, 1)}</td>
                <td className="py-2 text-right">-</td>
                <td className="py-2 text-right font-bold">{formatDeZahl(hues, 1)} kg</td>
                <td className="py-2 text-right font-bold text-shiraz bg-off-white px-2">{formatDeZahl((hues * betonMengeL / 1000), 2)} kg</td>
              </tr>
            )}
            {biochar > 0 && (
              <tr>
                <td className="py-2">Pflanzenkohle (Biochar)</td>
                <td className="py-2 text-right">{formatDeZahl(biochar, 1)}</td>
                <td className="py-2 text-right">{formatDeZahl(feuchteBiochar, 1)}</td>
                <td className="py-2 text-right font-bold">{formatDeZahl(results.biochar_feucht, 1)} kg</td>
                <td className="py-2 text-right font-bold text-shiraz bg-off-white px-2">{formatDeZahl((results.biochar_feucht * betonMengeL / 1000), 2)} kg</td>
              </tr>
            )}
            <tr>
              <td className="py-2">Gestein 0/4</td>
              <td className="py-2 text-right">{formatDeZahl(results.m04_tr, 1)}</td>
              <td className="py-2 text-right">{formatDeZahl(feuchte04, 1)}</td>
              <td className="py-2 text-right font-bold">{formatDeZahl(results.m04_feucht, 1)} kg</td>
              <td className="py-2 text-right font-bold text-shiraz bg-off-white px-2">{formatDeZahl((results.m04_feucht * betonMengeL / 1000), 2)} kg</td>
            </tr>
            <tr>
              <td className="py-2">Gestein 4/8</td>
              <td className="py-2 text-right">{formatDeZahl(results.m48_tr, 1)}</td>
              <td className="py-2 text-right">{formatDeZahl(feuchte48, 1)}</td>
              <td className="py-2 text-right font-bold">{formatDeZahl(results.m48_feucht, 1)} kg</td>
              <td className="py-2 text-right font-bold text-shiraz bg-off-white px-2">{formatDeZahl((results.m48_feucht * betonMengeL / 1000), 2)} kg</td>
            </tr>
            {dmax >= 16 && (
              <tr>
                <td className="py-2">Gestein 8/16</td>
                <td className="py-2 text-right">{formatDeZahl(results.m816_tr, 1)}</td>
                <td className="py-2 text-right">{formatDeZahl(feuchte816, 1)}</td>
                <td className="py-2 text-right font-bold">{formatDeZahl(results.m816_feucht, 1)} kg</td>
                <td className="py-2 text-right font-bold text-shiraz bg-off-white px-2">{formatDeZahl((results.m816_feucht * betonMengeL / 1000), 2)} kg</td>
              </tr>
            )}
            {dmax >= 32 && (
              <tr>
                <td className="py-2">Gestein 16/32</td>
                <td className="py-2 text-right">{formatDeZahl(results.m1632_tr, 1)}</td>
                <td className="py-2 text-right">{formatDeZahl(feuchte1632, 1)}</td>
                <td className="py-2 text-right font-bold">{formatDeZahl(results.m1632_feucht, 1)} kg</td>
                <td className="py-2 text-right font-bold text-shiraz bg-off-white px-2">{formatDeZahl((results.m1632_feucht * betonMengeL / 1000), 2)} kg</td>
              </tr>
            )}
            {zusatzmittel > 0 && (
              <tr>
                <td className="py-2">Zusatzmittel</td>
                <td className="py-2 text-right">{formatDeZahl(zusatzmittel, 1)}</td>
                <td className="py-2 text-right">-</td>
                <td className="py-2 text-right font-bold">{formatDeZahl(zusatzmittel, 1)} kg</td>
                <td className="py-2 text-right font-bold text-shiraz bg-off-white px-2">{formatDeZahl((zusatzmittel * betonMengeL / 1000), 2)} kg</td>
              </tr>
            )}
            {stahlfaser > 0 && (
              <tr>
                <td className="py-2">Stahlfasern / Metallfasern (DIN EN 14889-1)</td>
                <td className="py-2 text-right">{formatDeZahl(stahlfaser, 1)}</td>
                <td className="py-2 text-right">-</td>
                <td className="py-2 text-right font-bold">{formatDeZahl(stahlfaser, 1)} kg</td>
                <td className="py-2 text-right font-bold text-shiraz bg-off-white px-2">{formatDeZahl((stahlfaser * betonMengeL / 1000), 2)} kg</td>
              </tr>
            )}
            {ppFaser > 0 && (
              <tr>
                <td className="py-2">Polypropylenfasern (PP) (DIN EN 14889-2)</td>
                <td className="py-2 text-right">{formatDeZahl(ppFaser, 2)}</td>
                <td className="py-2 text-right">-</td>
                <td className="py-2 text-right font-bold">{formatDeZahl(ppFaser, 2)} kg</td>
                <td className="py-2 text-right font-bold text-shiraz bg-off-white px-2">{formatDeZahl((ppFaser * betonMengeL / 1000), 3)} kg</td>
              </tr>
            )}
            <tr>
              <td className="py-2 flex items-center gap-1">
                <span>Luftporen (Luftgehalt)</span>
                <InfoTooltip text="Luftporen nehmen Raum im Stoffraumgefüge ein, weisen jedoch kein nennenswertes hydrostatisches Gewicht auf." />
              </td>
              <td className="py-2 text-right text-slate-400">0,0 <span className="text-[10px] text-slate-400">(Vol: {formatDeZahl(results.volLuft, 1)} dm³)</span></td>
              <td className="py-2 text-right">-</td>
              <td className="py-2 text-right font-bold text-slate-600">{formatDeZahl(luft, 1)} Vol.-%</td>
              <td className="py-2 text-right font-bold text-shiraz bg-off-white px-2">{formatDeZahl((results.volLuft * betonMengeL / 1000), 2)} L <span className="text-[10px] font-normal text-shiraz/70">(Vol.)</span></td>
            </tr>
            <tr className="bg-home-grau/5">
              <td className="py-2">Gesamtwasser</td>
              <td className="py-2 text-right">{formatDeZahl(results.wasserTrocken, 1)}</td>
              <td className="py-2 text-right">-</td>
              <td className="py-2 text-right text-home-grau">davon aus Gestein: {formatDeZahl(results.wasserAusGestein, 1)} L</td>
              <td className="py-2 text-right text-shiraz/70 bg-off-white px-2">daraus: {formatDeZahl((results.wasserAusGestein * betonMengeL / 1000), 2)} L</td>
            </tr>
            <tr className="border-t-2 border-home-grau/30 font-bold text-shiraz">
              <td className="py-2">Zugabewasser</td>
              <td className="py-2 text-right">-</td>
              <td className="py-2 text-right">-</td>
              <td className="py-2 text-right">{formatDeZahl(results.zugabewasser, 1)} Liter</td>
              <td className="py-2 text-right bg-shiraz/10 px-2 rounded-b-md">{formatDeZahl((results.zugabewasser * betonMengeL / 1000), 2)} Liter</td>
            </tr>
          </tbody>
        </table>
      </div>
      </NachErstemBild>
    </div>
  );
}
