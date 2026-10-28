import { Flame, CheckCircle2, AlertTriangle } from 'lucide-react';
import { InlineMath, BlockMath } from 'react-katex';
import { formatDeWert, formatDeTeXWert, formatDeTeX, formatDeZahl } from '@/src/utils/numberFormat';
import React from 'react';
import inhalt from '@/content/beispielrechnungen/RechnungBrandschutz.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { AuswahlGruppe, ReiterLeiste, alsOption, alsReiter, reiterPanel } from '../../components/ui/Auswahlgruppe';
import { EC2_BRAND_MINDESTMASSE } from '@/src/data/brandschutzBeton';

/** Zeilenbeschriftung und Stützenmaß je Feuerwiderstandsklasse (Reihenfolge wie EC2_BRAND_MINDESTMASSE) */
const TABELLE_TEXTE: readonly (readonly [string, string])[] = [
  [inhalt.texte.r3030Min, inhalt.texte.t200MmA25],
  [inhalt.texte.r6060Min, inhalt.texte.t250MmA35],
  [inhalt.texte.r9090Min, inhalt.texte.t300MmA45],
  [inhalt.texte.r120120Min, inhalt.texte.t350MmA55],
];

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
            <span><MdText text={inhalt.texte.brandschutzHeißbemessungNachEurocode} /></span>
          </h3>
          <p className="text-xs text-text-main/80 leading-relaxed font-normal"><MdText text={inhalt.texte.wasBerechnungDesBrandwiderstands} /></p>
        </div>

        {/* Sub-Tab Selector for Brandschutz */}
        <ReiterLeiste label="Beispielrechnungen Brandschutz" className="flex gap-2 border-b border-home-grau/20 pb-3">
          <button {...alsReiter(brandSubTab === 'holz_abbrand', 'rechnung-brand', 'holz_abbrand')}
            type="button"
            onClick={() => setBrandSubTab('holz_abbrand')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  brandSubTab === 'holz_abbrand'
                    ? 'bg-shiraz text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
          ><MdText text={inhalt.texte.holzbauEffektiverRestquerschnittEc5} /></button>
          <button {...alsReiter(brandSubTab === 'beton_tabelle', 'rechnung-brand', 'beton_tabelle')}
            type="button"
            onClick={() => setBrandSubTab('beton_tabelle')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  brandSubTab === 'beton_tabelle'
                    ? 'bg-shiraz text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
          ><MdText text={inhalt.texte.stahlbetonMindestabmessungenAchsabstandE} /></button>
        </ReiterLeiste>

        {brandSubTab === 'holz_abbrand' && (
          <div {...reiterPanel('rechnung-brand', brandSubTab)} className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-200">
            {/* Controls Left */}
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
              <h3 className="font-bold text-sm text-slate-800 border-b border-slate-200 pb-2 flex items-center justify-between">
                <span><MdText text={inhalt.texte.holzträgerEingabenBrandfall} /></span>
                <Flame size={16} className="text-shiraz" />
              </h3>

              {/* Holzart */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block"><MdText text={inhalt.texte.holzartFestigkeit} /></label>
                <select aria-label={inhalt.werte.holzartFestigkeit}
                  value={holzArtBrand}
                  onChange={(e) => setHolzArtBrand(e.target.value as "laubholz" | "bsh" | "c24")}
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
                  <label className="text-xs font-bold text-slate-700 block"><MdText text={inhalt.texte.breiteBCm} /></label>
                  <input aria-label={inhalt.werte.breiteBCm} 
                    type="number" min="0" 
                    value={holzBreite}
                    onChange={(e) => setHolzBreite(Math.max(8, parseFloat(e.target.value) || 8))}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block"><MdText text={inhalt.texte.höheHCm} /></label>
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
                <AuswahlGruppe label="Beflammung" className="grid grid-cols-2 gap-2 text-xs">
                  <button {...alsOption(brandBeanspruchung === '3_seitig')}
                    type="button"
                    onClick={() => setBrandBeanspruchung('3_seitig')}
                    className={`p-2 rounded-lg border text-center font-sans cursor-pointer transition-all ${
                          brandBeanspruchung === '3_seitig'
                            ? 'bg-shiraz text-white border-shiraz font-bold shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200'
                        }`}
                  ><MdText text={inhalt.texte.t3SeitigDeckenbalken} /></button>
                  <button {...alsOption(brandBeanspruchung === '4_seitig')}
                    type="button"
                    onClick={() => setBrandBeanspruchung('4_seitig')}
                    className={`p-2 rounded-lg border text-center font-sans cursor-pointer transition-all ${
                          brandBeanspruchung === '4_seitig'
                            ? 'bg-shiraz text-white border-shiraz font-bold shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200'
                        }`}
                  ><MdText text={inhalt.texte.t4SeitigFreieStütze} /></button>
                </AuswahlGruppe>
              </div>

              {/* Branddauer */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Feuerwiderstandsdauer:</label>
                <div className="grid grid-cols-4 gap-2 text-xs font-mono">
                  {[30, 60, 90, 120].map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setBrandDauerMin(mins as 60 | 30 | 90 | 120)}
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
                  <span><MdText text={inhalt.texte.biegemomentKaltzustandMEd} /></span>
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
              <h3 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-2"><MdText text={inhalt.texte.nachweisNachDinEn} /></h3>

              <div className="space-y-3.5 text-xs text-text-main/80 font-sans">
                <div><MdText text={inhalt.texte.schritt1RechnerischeAbbrandtiefe} /><p className="mt-0.5 text-xxs text-slate-500"><MdText text={inhalt.texte.zuschlagD07} /></p>
                  <div className="my-1.5 p-2 bg-slate-50 rounded border border-slate-200 text-center font-mono">
                    <BlockMath math={`d_{\\text{char},n} = ${formatDeTeXWert(beta_char)} \\cdot ${brandDauerMin} = ${formatDeTeX(d_char_n, 1)} \\, \\text{mm}`} />
                    <BlockMath math={`d_{\\text{ef}} = ${formatDeTeX(d_char_n, 1)} + 7{,}0 = \\color{#A3113E}{\\mathbf{${formatDeTeX(d_ef, 1)}}} \\, \\text{mm}`} />
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-2.5"><MdText text={inhalt.texte.schritt2EffektiverRestquerschnitt} /><div className="my-1.5 p-2 bg-slate-50 rounded border border-slate-200 text-center font-mono">
                    <BlockMath math={`b_{\\text{ef}} = ${formatDeTeXWert(holzBreite * 10)} - 2 \\cdot ${formatDeTeX(d_ef, 1)} = \\mathbf{${formatDeTeX(b_ef_mm, 1)}} \\, \\text{mm}`} />
                    <BlockMath math={`h_{\\text{ef}} = ${holzHoehe * 10} - ${brandBeanspruchung === '4_seitig' ? '2 \\cdot ' : ''}${formatDeTeX(d_ef, 1)} = \\mathbf{${formatDeTeX(h_ef_mm, 1)}} \\, \\text{mm}`} />
                    <BlockMath math={`W_{\\text{ef}} = \\frac{b_{\\text{ef}} \\cdot h_{\\text{ef}}^2}{6} = \\mathbf{${formatDeTeX((W_ef_mm3 / 1000), 0)}} \\, \\text{cm}^3`} />
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-2.5"><MdText text={inhalt.texte.schritt3HeißtragfähigkeitM} /><div className="my-1.5 p-2 bg-slate-50 rounded border border-slate-200 text-center font-mono">
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
          <div {...reiterPanel('rechnung-brand', brandSubTab)} className="bg-white p-5 rounded-xl border border-slate-200 space-y-4 animate-in fade-in duration-200">
            <h4 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-2"><MdText text={inhalt.texte.stahlbetonBrandschutzTabellarischeMindes} /></h4>
            <p className="text-xs text-text-main/70"><MdText text={inhalt.texte.dieHeißbemessungVonBetonbauteilen} /></p>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-mono text-[10px] uppercase">
                    <th className="py-2">Brandklasse</th>
                    <th className="py-2"><MdText text={inhalt.texte.einfeldträgerMindestbreiteBMin} /></th>
                    <th className="py-2"><MdText text={inhalt.texte.achsabstandABalken} /></th>
                    <th className="py-2"><MdText text={inhalt.texte.plattendickeHMin} /></th>
                    <th className="py-2"><MdText text={inhalt.texte.stützenMindestmaßBMin} /></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 text-[11px]">
                  {EC2_BRAND_MINDESTMASSE.map((z, i) => (
                    <tr key={z.klasse}>
                      <td className="py-2.5 font-bold text-shiraz"><MdText text={TABELLE_TEXTE[i][0]} /></td>
                      <td className="py-2.5 font-mono">{formatDeWert(z.balkenB)} mm</td>
                      <td className="py-2.5 font-mono">{formatDeWert(z.balkenA)} mm</td>
                      <td className="py-2.5 font-mono">{formatDeWert(z.platteH)} mm</td>
                      <td className="py-2.5 font-mono"><MdText text={TABELLE_TEXTE[i][1]} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900"><MdText text={inhalt.texte.achtungBeiHochfestemBeton} /></div>
          </div>
        )}
      </div>
    );
}
