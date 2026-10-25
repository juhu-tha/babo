import { Flame, CheckCircle2, AlertTriangle } from 'lucide-react';
import { InlineMath, BlockMath } from 'react-katex';
import { formatDeWert, formatDeTeXWert, formatDeTeX, formatDeZahl } from '@/src/utils/numberFormat';
import React from 'react';

interface RechnungBrandschutzProps {
  M_fi_Ed: number;
  M_fi_Rd: number;
  W_ef_mm3: number;
  b_ef_mm: number;
  beta_char: 0.7 | 0.8 | 0.55;
  brandBeanspruchung: "3_seitig" | "4_seitig";
  brandDauerMin: 60 | 30 | 90 | 120;
  brandSubTab: "holz_abbrand" | "beton_tabelle";
  brand_holz_passed: boolean;
  d_char_n: number;
  d_ef: number;
  eta_brand_holz: number;
  h_ef_mm: number;
  holzArtBrand: "c24" | "bsh" | "laubholz";
  holzBreite: number;
  holzHoehe: number;
  momentKaltEd: number;
  setBrandBeanspruchung: React.Dispatch<React.SetStateAction<"3_seitig" | "4_seitig">>;
  setBrandDauerMin: React.Dispatch<React.SetStateAction<60 | 30 | 90 | 120>>;
  setBrandSubTab: React.Dispatch<React.SetStateAction<"holz_abbrand" | "beton_tabelle">>;
  setHolzArtBrand: React.Dispatch<React.SetStateAction<"c24" | "bsh" | "laubholz">>;
  setHolzBreite: React.Dispatch<React.SetStateAction<number>>;
  setHolzHoehe: React.Dispatch<React.SetStateAction<number>>;
  setMomentKaltEd: React.Dispatch<React.SetStateAction<number>>;
}

export default function RechnungBrandschutz({ M_fi_Ed, M_fi_Rd, W_ef_mm3, b_ef_mm, beta_char, brandBeanspruchung, brandDauerMin, brandSubTab, brand_holz_passed, d_char_n, d_ef, eta_brand_holz, h_ef_mm, holzArtBrand, holzBreite, holzHoehe, momentKaltEd, setBrandBeanspruchung, setBrandDauerMin, setBrandSubTab, setHolzArtBrand, setHolzBreite, setHolzHoehe, setMomentKaltEd }: RechnungBrandschutzProps) {
  return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
          <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5">
            <Flame className="text-shiraz" size={18} />
            <span>Brandschutz: Heißbemessung nach Eurocode 5 (Holz) &amp; Eurocode 2 (Beton)</span>
          </h3>
          <p className="text-xs text-text-main/80 leading-relaxed font-normal">
            <strong>Was?</strong> Berechnung des Brandwiderstands tragender Bauteile unter der <strong>Einheits-Temperaturzeitkurve (ETK)</strong> nach DIN EN 1363-1 / DIN 4102-2. <br />
            <strong>Warum?</strong> Nachweis der Mindest-Feuerwiderstandsdauer (R30 bis R120) zur Rettung von Menschenleben und Gewährleistung sicherer Löscharbeiten der Feuerwehr gemäß Musterbauordnung (MBO). <br />
            <strong>Wie?</strong> Im Holzbau über die <strong>Methode des effektiven Restquerschnitts</strong> (konstante Abbrandrate <InlineMath math="\beta" /> plus Entfestigungszone <InlineMath math="d_0 = 7\,\text{mm}" />). Im Massivbau über Mindestbauteilbreiten und Achsabstände der Bewehrung.
          </p>
        </div>

        {/* Sub-Tab Selector for Brandschutz */}
        <div className="flex gap-2 border-b border-home-grau/20 pb-3">
          <button aria-pressed={brandSubTab === 'holz_abbrand'}
            type="button"
            onClick={() => setBrandSubTab('holz_abbrand')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  brandSubTab === 'holz_abbrand'
                    ? 'bg-shiraz text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
          >
            🌲 Holzbau: Effektiver Restquerschnitt (EC5-1-2)
          </button>
          <button aria-pressed={brandSubTab === 'beton_tabelle'}
            type="button"
            onClick={() => setBrandSubTab('beton_tabelle')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  brandSubTab === 'beton_tabelle'
                    ? 'bg-shiraz text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
          >
            🧱 Stahlbeton: Mindestabmessungen &amp; Achsabstand (EC2-1-2)
          </button>
        </div>

        {brandSubTab === 'holz_abbrand' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-200">
            {/* Controls Left */}
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
              <h3 className="font-bold text-sm text-slate-800 border-b border-slate-200 pb-2 flex items-center justify-between">
                <span>Holzträger-Eingaben (Brandfall)</span>
                <Flame size={16} className="text-shiraz" />
              </h3>

              {/* Holzart */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Holzart &amp; Festigkeit:</label>
                <select aria-label="Holzart &amp; Festigkeit"
                  value={holzArtBrand}
                  onChange={(e) => setHolzArtBrand(e.target.value as any)}
                  className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-sans text-slate-800"
                >
                  <option value="bsh">Brettschichtholz GL28h (β_n = 0,70 mm/min, fmk = 28 N/mm²)</option>
                  <option value="c24">Vollholz Nadelholz C24 (β_n = 0,80 mm/min, fmk = 24 N/mm²)</option>
                  <option value="laubholz">Laubholz D30 / Buche (β_n = 0,55 mm/min, fmk = 30 N/mm²)</option>
                </select>
              </div>

              {/* Querschnitt b x h */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Breite b [cm]:</label>
                  <input aria-label="Breite b [cm]" 
                    type="number" min="0" 
                    value={holzBreite}
                    onChange={(e) => setHolzBreite(Math.max(8, parseFloat(e.target.value) || 8))}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Höhe h [cm]:</label>
                  <input aria-label="Höhe h [cm]" 
                    type="number" min="0" 
                    value={holzHoehe}
                    onChange={(e) => setHolzHoehe(Math.max(12, parseFloat(e.target.value) || 12))}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              {/* Brandbeanspruchung */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Beflammung:</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button aria-pressed={brandBeanspruchung === '3_seitig'}
                    type="button"
                    onClick={() => setBrandBeanspruchung('3_seitig')}
                    className={`p-2 rounded-lg border text-center font-sans cursor-pointer transition-all ${
                          brandBeanspruchung === '3_seitig'
                            ? 'bg-shiraz text-white border-shiraz font-bold shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200'
                        }`}
                  >
                    3-seitig (Deckenbalken)
                  </button>
                  <button aria-pressed={brandBeanspruchung === '4_seitig'}
                    type="button"
                    onClick={() => setBrandBeanspruchung('4_seitig')}
                    className={`p-2 rounded-lg border text-center font-sans cursor-pointer transition-all ${
                          brandBeanspruchung === '4_seitig'
                            ? 'bg-shiraz text-white border-shiraz font-bold shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200'
                        }`}
                  >
                    4-seitig (freie Stütze)
                  </button>
                </div>
              </div>

              {/* Branddauer */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Feuerwiderstandsdauer:</label>
                <div className="grid grid-cols-4 gap-2 text-xs font-mono">
                  {[30, 60, 90, 120].map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setBrandDauerMin(mins as any)}
                      className={`p-2 rounded-lg border text-center cursor-pointer transition-all font-bold ${
                            brandDauerMin === mins 
                              ? 'bg-shiraz text-white border-shiraz shadow-xs' 
                              : 'bg-white text-slate-700 border-slate-200'
                          }`}
                    >
                      R{formatDeWert(mins)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Biegemoment Kaltzustand */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>Biegemoment Kaltzustand (M_Ed):</span>
                  <span className="text-shiraz font-mono">{formatDeWert(momentKaltEd)} kNm</span>
                </div>
                <input 
                  type="range" 
                  min="10" 
                  max="150" 
                  step="5" 
                  value={momentKaltEd} 
                  onChange={(e) => setMomentKaltEd(parseInt(e.target.value))}
                  className="w-full accent-shiraz"
                />
              </div>
            </div>

            {/* Calculation Right */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
              <h3 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-2">
                Nachweis nach DIN EN 1995-1-2 (Restquerschnittsmethode)
              </h3>

              <div className="space-y-3.5 text-xs text-text-main/80 font-sans">
                <div>
                  <strong>Schritt 1: Rechnerische Abbrandtiefe d_char,n &amp; d_ef</strong>
                  <p className="mt-0.5 text-xxs text-slate-500">
                    Zuschlag <InlineMath math="d_0 = 7\,\text{mm}" /> für die temperaturgeschädigte Kohleschicht:
                  </p>
                  <div className="my-1.5 p-2 bg-slate-50 rounded border border-slate-200 text-center font-mono">
                    <BlockMath math={`d_{\\text{char},n} = ${formatDeTeXWert(beta_char)} \\cdot ${brandDauerMin} = ${formatDeTeX(d_char_n, 1)} \\, \\text{mm}`} />
                    <BlockMath math={`d_{\\text{ef}} = ${formatDeTeX(d_char_n, 1)} + 7{,}0 = \\color{#A3113E}{\\mathbf{${formatDeTeX(d_ef, 1)}}} \\, \\text{mm}`} />
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-2.5">
                  <strong>Schritt 2: Effektiver Restquerschnitt b_ef × h_ef</strong>
                  <div className="my-1.5 p-2 bg-slate-50 rounded border border-slate-200 text-center font-mono">
                    <BlockMath math={`b_{\\text{ef}} = ${formatDeTeXWert(holzBreite * 10)} - 2 \\cdot ${formatDeTeX(d_ef, 1)} = \\mathbf{${formatDeTeX(b_ef_mm, 1)}} \\, \\text{mm}`} />
                    <BlockMath math={`h_{\\text{ef}} = ${holzHoehe * 10} - ${brandBeanspruchung === '4_seitig' ? '2 \\cdot ' : ''}${formatDeTeX(d_ef, 1)} = \\mathbf{${formatDeTeX(h_ef_mm, 1)}} \\, \\text{mm}`} />
                    <BlockMath math={`W_{\\text{ef}} = \\frac{b_{\\text{ef}} \\cdot h_{\\text{ef}}^2}{6} = \\mathbf{${formatDeTeX((W_ef_mm3 / 1000), 0)}} \\, \\text{cm}^3`} />
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-2.5">
                  <strong>Schritt 3: Heißtragfähigkeit M_fi,Rd vs. Einwirkung M_fi,Ed</strong>
                  <div className="my-1.5 p-2 bg-slate-50 rounded border border-slate-200 text-center font-mono">
                    <BlockMath math={`M_{\\text{fi,Ed}} = 0{,}60 \\cdot ${formatDeTeXWert(momentKaltEd)} = \\mathbf{${formatDeTeX(M_fi_Ed, 1)}} \\, \\text{kNm}`} />
                    <BlockMath math={`M_{\\text{fi,Rd}} = W_{\\text{ef}} \\cdot f_{m,\\text{fi},d} = \\mathbf{${formatDeTeX(M_fi_Rd, 1)}} \\, \\text{kNm}`} />
                    <BlockMath math={`\\eta_{\\text{fi}} = \\frac{${formatDeTeX(M_fi_Ed, 1)}}{${formatDeTeX(M_fi_Rd, 1)}} = \\color{#A3113E}{\\mathbf{${formatDeTeX(eta_brand_holz, 2)}}} \\, ${brand_holz_passed ? '\\le 1{,}0' : '> 1{,}0'}`} />
                  </div>
                </div>

                <div className={`p-3.5 rounded-xl border ${
                      brand_holz_passed 
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900' 
                        : 'bg-rose-50 border-rose-300 text-rose-900'
                    }`}>
                  <div className="flex items-center gap-2 font-bold text-xs">
                    {brand_holz_passed ? <CheckCircle2 size={16} className="text-emerald-700" /> : <AlertTriangle size={16} className="text-rose-700" />}
                    <span>{brand_holz_passed ? `Feuerwiderstand R${brandDauerMin} ERFÜLLT (Ausnutzung ${formatDeZahl((eta_brand_holz * 100), 0)} %)` : `Feuerwiderstand R${brandDauerMin} NICHT ERFÜLLT (Überlastung ${formatDeZahl((eta_brand_holz * 100), 0)} %)`}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {brandSubTab === 'beton_tabelle' && (
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4 animate-in fade-in duration-200">
            <h4 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-2">
              Stahlbeton-Brandschutz: Tabellarische Mindestmaße nach DIN EN 1992-1-2
            </h4>
            <p className="text-xs text-text-main/70">
              Die Heißbemessung von Betonbauteilen erfolgt in der Praxis meist über das normative Tabellenverfahren. Maßgebend sind die Mindestbauteildicke <InlineMath math="b_{\text{min}}" /> und der Achsabstand <InlineMath math="a" /> der Bewehrungsstäbe zum Brandrand, um die Stahltemperatur unter <InlineMath math="500^\circ\text{C}" /> zu halten.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-mono text-[10px] uppercase">
                    <th className="py-2">Brandklasse</th>
                    <th className="py-2">Einfeldträger Mindestbreite b_min</th>
                    <th className="py-2">Achsabstand a (Balken)</th>
                    <th className="py-2">Plattendicke h_min</th>
                    <th className="py-2">Stützen Mindestmaß b_min</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 text-[11px]">
                  <tr>
                    <td className="py-2.5 font-bold text-shiraz">R30 (30 min)</td>
                    <td className="py-2.5 font-mono">80 mm</td>
                    <td className="py-2.5 font-mono">25 mm</td>
                    <td className="py-2.5 font-mono">60 mm</td>
                    <td className="py-2.5 font-mono">200 mm (a = 25 mm)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold text-shiraz">R60 (60 min)</td>
                    <td className="py-2.5 font-mono">120 mm</td>
                    <td className="py-2.5 font-mono">35 mm</td>
                    <td className="py-2.5 font-mono">80 mm</td>
                    <td className="py-2.5 font-mono">250 mm (a = 35 mm)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold text-shiraz">R90 (90 min)</td>
                    <td className="py-2.5 font-mono">160 mm</td>
                    <td className="py-2.5 font-mono">45 mm</td>
                    <td className="py-2.5 font-mono">100 mm</td>
                    <td className="py-2.5 font-mono">300 mm (a = 45 mm)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold text-shiraz">R120 (120 min)</td>
                    <td className="py-2.5 font-mono">200 mm</td>
                    <td className="py-2.5 font-mono">55 mm</td>
                    <td className="py-2.5 font-mono">120 mm</td>
                    <td className="py-2.5 font-mono">350 mm (a = 55 mm)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900">
              <strong>Achtung bei hochfestem Beton (UHPC / &gt; C55/67):</strong> Abplatzungsgefahr durch inneren Dampfdruck! Nach DIN EN 1992-1-2 ist bei hochfestem Beton die Zugabe von mindestens 2 kg/m³ Polypropylen-Fasern (PP-Fasern) zwingend erforderlich.
            </div>
          </div>
        )}
      </div>
    );
}
