import { Flame, Volume2 } from 'lucide-react';
import { InlineMath } from 'react-katex';
import { formatDeWert, formatDeTeXWert, formatDeZahl, formatDeTeX } from '@/src/utils/numberFormat';
import type { Dispatch, SetStateAction } from 'react';
import { BSP_AUFBAUTEN, BSP_ROLLSCHUB, type BspSchwingungErgebnis, type EiVerfahren, type Estrichart } from '@/src/calc/bspSchwingung';
import { EingabeHinweise } from '@/src/components/ui/EingabeHinweise';
import inhalt from '@/content/holzbaubeta/HolzbauBauphysik.json';
import { MdText } from '@/src/components/inhalt/MdText';

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
  vib: BspSchwingungZustand;
}

/** Eingaben und Ergebnis des BSP-Schwingungsrechners (Zustand in HolzbauBeta.tsx) */
export interface BspSchwingungZustand {
  aufbau: string; setAufbau: Dispatch<SetStateAction<string>>;
  span: number; setSpan: Dispatch<SetStateAction<number>>;
  extraMass: number; setExtraMass: Dispatch<SetStateAction<number>>;
  breite: number; setBreite: Dispatch<SetStateAction<number>>;
  estrichDicke: number; setEstrichDicke: Dispatch<SetStateAction<number>>;
  estrichArt: Estrichart; setEstrichArt: Dispatch<SetStateAction<Estrichart>>;
  verfahren: EiVerfahren; setVerfahren: Dispatch<SetStateAction<EiVerfahren>>;
  rollschub: number; setRollschub: Dispatch<SetStateAction<number>>;
  ergebnis: BspSchwingungErgebnis;
}

export default function HolzbauBauphysik({ fireB, fireH, fireResults, fireSides, fireTime, fireType, setFireB, setFireH, setFireSides, setFireTime, setFireType, vib }: HolzbauBauphysikProps) {
  return (
      <div className="flex flex-col gap-6 animate-in fade-in duration-300" id="holz_tab_physics">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Fire Protection Box */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 flex flex-col gap-4">
            <h3 className="font-extrabold text-text-main text-base flex items-center gap-2 border-b border-home-grau/20 pb-2">
              <Flame size={18} className="text-amber-800 animate-pulse" /><MdText text={inhalt.texte.tragfähigerBrandschutzDurchVerkohlung} /></h3>

            <div className="text-xs text-text-main/80 space-y-3.5 leading-relaxed">
              <p><MdText text={inhalt.texte.holzIstBrennbarBrennt} /></p>

              <div className="bg-amber-50 p-3.5 rounded-lg border border-amber-200">
                <h4 className="font-bold text-amber-900 mb-1"><MdText text={inhalt.texte.standardAbbrandratenNachDin} /></h4>
                <ul className="list-disc list-inside space-y-1 text-[11px] font-mono text-amber-950">
                  <li><MdText text={inhalt.texte.nadelholzVollholzBshBeta} /></li>
                  <li><MdText text={inhalt.texte.laubholzRhoKGe} /></li>
                  <li><MdText text={inhalt.texte.imRechnerWirdN} /></li>
                </ul>
              </div>

              <div className="bg-off-white p-3 rounded-lg border border-home-grau/20">
                <span className="font-bold text-text-main block"><MdText text={inhalt.texte.berechnungDerIdeellenRestquerschnitts} /></span>
                <div className="my-1 text-center font-mono font-bold text-text-main">
                  <InlineMath math="d_{ef} = \beta_n \cdot t + k_0 \cdot d_0" />
                </div>
                <span className="text-[10px] text-text-main/50 font-normal leading-normal block"><MdText text={inhalt.texte.mitD07} /></span>
              </div>
            </div>
          </div>

          {/* Acoustic Insulation Box */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/30 flex flex-col gap-4">
            <h3 className="font-extrabold text-text-main text-base flex items-center gap-2 border-b border-home-grau/20 pb-2">
              <Volume2 size={18} className="text-amber-800" /><MdText text={inhalt.texte.schallschutzEntkopplungSchwingungen} /></h3>

            <div className="text-xs text-text-main/80 space-y-3.5 leading-relaxed">
              <p><MdText text={inhalt.texte.aufgrundDesGeringenEigengewichtes} /></p>

              <div className="bg-blue-50/50 p-3.5 rounded-lg border border-blue-200">
                <h4 className="font-bold text-blue-900 mb-1"><MdText text={inhalt.texte.konstruktiveMaßnahmenZurTrittschallminde} /></h4>
                <p className="text-[11px] text-text-main/75 mt-1"><MdText text={inhalt.texte.t1MasseZufuhrGebundene} /></p>
                <p className="text-[11px] text-text-main/75 mt-1.5"><MdText text={inhalt.texte.t2AkustischeEntkopplungElastomerlager} /></p>
              </div>

              <div className="bg-off-white p-3 rounded-lg border border-home-grau/20">
                <h4 className="font-black text-text-main text-xs mb-1"><MdText text={inhalt.texte.gebrauchstauglichkeitsgrenzkriteriumDeck} /></h4>
                <p className="text-text-main/75 leading-normal text-xs"><MdText text={inhalt.texte.eurocode573} /></p>
              </div>
            </div>
          </div>

        </div>

        {/* NEW INTERACTIVE: BRANDSCHUTZ- UND ABBRANDRECHNER */}
        <div className="bg-white p-6 rounded-xl border border-home-grau/30 flex flex-col gap-5">
          <div>
            <span className="text-xs uppercase font-black text-rose-700 tracking-wider"><MdText text={inhalt.texte.brandschutzResttragfähigkeit} /></span>
            <h3 className="font-extrabold text-text-main text-base mt-1 flex items-center gap-2">
              <Flame size={20} className="text-rose-600 animate-pulse" /><MdText text={inhalt.texte.holzAbbrandrechnerRestquerschnittsVisual} /></h3>
            <p className="text-xs text-text-main/70 leading-relaxed mt-1"><MdText text={inhalt.texte.berechnenSieDenVerbleibenden} /></p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Params (span 5) */}
            <div className="lg:col-span-12 xl:col-span-5 flex flex-col gap-4 bg-off-white p-4 rounded-xl border border-home-grau/20">
              <h4 className="font-bold text-xs uppercase tracking-wider text-text-main">Brandschutz-Parameter</h4>

              {/* Fire wood type */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-text-main"><MdText text={inhalt.texte.materialtypAbbrandrate} /></label>
                <select aria-label={inhalt.werte.materialtypUndAbbrandrate}
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
                  <label className="text-xs font-bold text-text-main"><MdText text={inhalt.texte.brandbeanspruchungMin} /></label>
                  <select aria-label={inhalt.werte.brandbeanspruchungMin}
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
                  <label className="text-xs font-bold text-text-main"><MdText text={inhalt.texte.balkenbreiteBMm} /></label>
                  <input aria-label={inhalt.werte.balkenbreiteBMm}
                    type="number" min="0"
                    value={fireB}
                    onChange={(e) => setFireB(Math.max(60, parseInt(e.target.value) || 60))}
                    className="border border-home-grau/30 rounded-lg p-2 text-xs bg-white text-text-main font-semibold"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-text-main"><MdText text={inhalt.texte.balkenhöheHMm} /></label>
                  <input aria-label={inhalt.werte.balkenhöheHMm}
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
                  Nach <span className="font-bold">{formatDeWert(fireTime)} min</span><MdText text={inhalt.texte.brandeinwirkungMit} /><InlineMath math={`\\beta = ${formatDeTeXWert(fireResults.beta_0)}\\text{ mm/min}`} />:
                </p>

                <div className="grid grid-cols-2 gap-4 mt-2.5">
                  <div className="bg-white p-3 rounded-lg border border-home-grau/10">
                    <span className="text-[9px] text-text-main/40 font-bold block uppercase"><MdText text={inhalt.texte.verkohlteSchichttiefeDEf} /></span>
                    <span className="font-mono text-base font-black text-rose-700">
                      {formatDeZahl(fireResults.d_ef, 1)} mm
                    </span>
                    <span className="text-[9px] text-text-main/50 block leading-tight mt-0.5">
                      ({formatDeZahl(fireResults.d_char0, 1)}<MdText text={inhalt.texte.mmKohleK7} /></span>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-home-grau/10">
                    <span className="text-[9px] text-text-main/40 font-bold block uppercase"><MdText text={inhalt.texte.statischerRestquerschnitt} /></span>
                    {fireResults.isCollapsed ? (
                      <span className="font-mono text-sm font-black text-rose-600"><MdText text={inhalt.texte.komplettZerstört} /></span>
                    ) : (
                      <span className="font-mono text-base font-black text-emerald-800">
                        {formatDeZahl(fireResults.b_fi, 0)} x {formatDeZahl(fireResults.h_fi, 0)} mm
                      </span>
                    )}
                    <span className="text-[9px] text-text-main/50 block leading-tight mt-0.5"><MdText text={inhalt.texte.wirksamFürKaltbemessungNach} /></span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div className="text-xs bg-white p-2.5 rounded border border-home-grau/10 text-center">
                    <span className="text-text-main/50 font-semibold block text-[10px]"><MdText text={inhalt.texte.verlustQuerschnittsfläche} /></span>
                    <span className="font-mono font-black text-rose-700 text-sm">{formatDeZahl(fireResults.areaLossPercent, 1)}%</span>
                  </div>
                  <div className="text-xs bg-white p-2.5 rounded border border-home-grau/10 text-center">
                    <span className="text-text-main/50 font-semibold block text-[10px]"><MdText text={inhalt.texte.verlustWiderstandsmomentW} /></span>
                    <span className="font-mono font-black text-rose-700 text-sm">{formatDeZahl(fireResults.stiffnessLossPercent, 1)}%</span>
                  </div>
                </div>
              </div>

              {/* 2D Charred section representation */}
              <div className="border border-home-grau/25 bg-white p-4 rounded-xl flex flex-col items-center justify-center gap-2">
                <span className="text-[9px] text-stone-500 font-bold uppercase tracking-wider block"><MdText text={inhalt.texte.querschnittsentwicklungGrauVorherSchwarz} /></span>

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
                    <span className="text-emerald-800 font-bold"><MdText text={inhalt.texte.restquerschnittDeutlichVorhandenNachweis} /></span>
                  ) : fireResults.isCollapsed ? (
                    <span className="text-rose-700 font-bold"><MdText text={inhalt.texte.keinRestquerschnittQuerschnittFür} /></span>
                  ) : (
                    <span className="text-amber-700 font-bold"><MdText text={inhalt.texte.starkeQuerschnittsminderungQuerschnittVe} /></span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* DECKEN-SCHWINGUNGSRECHNER Brettsperrholz (Rechenkern src/calc/bspSchwingung.ts) */}
        <div className="bg-white p-6 rounded-xl border border-home-grau/30 flex flex-col gap-5">
          <div>
            <span className="text-xs uppercase font-black text-blue-700 tracking-wider"><MdText text={inhalt.texte.akkustischerKomfortTragsicherheit} /></span>
            <h3 className="font-extrabold text-text-main text-base mt-1 flex items-center gap-2">
              <Volume2 size={20} className="text-blue-600" /><MdText text={inhalt.texte.cltDeckenSchwingungsEigenfrequenzrechner} /></h3>
            <p className="text-xs text-text-main/70 leading-relaxed mt-1"><MdText text={inhalt.texte.leichteHolzdeckenKönnenDurch} /></p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Inputs (span 5) */}
            <div className="lg:col-span-12 xl:col-span-5 flex flex-col gap-4 bg-off-white p-4 rounded-xl border border-home-grau/20">
              <h4 className="font-bold text-xs uppercase tracking-wider text-text-main">Decken-Parameter</h4>

              {/* Span L */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-text-main"><MdText text={inhalt.texte.deckenspannweiteLM} /></label>
                  <span className="font-mono text-xs font-black text-blue-700">{formatDeZahl(vib.span, 2)} m</span>
                </div>
                <input aria-label={inhalt.werte.bspSpannweite}
                  type="range"
                  min="3.0"
                  max="8.0"
                  step="0.1"
                  value={vib.span}
                  onChange={(e) => vib.setSpan(parseFloat(e.target.value))}
                  className="w-full accent-blue-700 cursor-pointer"
                />
              </div>

              {/* Aufbau */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-text-main"><MdText text={inhalt.texte.brettsperrholzPlattenstärkeTMm} /></label>
                <select aria-label={inhalt.werte.brettsperrholzPlattenstärkeTMm}
                  value={vib.aufbau}
                  onChange={(e) => vib.setAufbau(e.target.value)}
                  className="border border-home-grau/30 bg-white text-xs p-2 rounded-lg text-text-main font-semibold"
                >
                  {Object.entries(BSP_AUFBAUTEN).map(([id, a]) => <option key={id} value={id}>{a.label}</option>)}
                </select>
              </div>

              {/* Verfahren EI */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-text-main"><MdText text={inhalt.texte.bspVerfahrenEi} /></label>
                <select aria-label={inhalt.werte.bspVerfahrenEi}
                  value={vib.verfahren}
                  onChange={(e) => vib.setVerfahren(e.target.value as EiVerfahren)}
                  className="border border-home-grau/30 bg-white text-xs p-2 rounded-lg text-text-main font-semibold"
                >
                  <option value="gamma">{inhalt.werte.bspVerfahrenGamma}</option>
                  <option value="netto">{inhalt.werte.bspVerfahrenNetto}</option>
                </select>
              </div>

              {/* Rollschubmodul G_r (T10-HB-2) */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-text-main"><MdText text={inhalt.texte.bspRollschub} /></label>
                <select aria-label={inhalt.werte.bspRollschub}
                  value={vib.rollschub}
                  onChange={(e) => vib.setRollschub(Number(e.target.value))}
                  className="border border-home-grau/30 bg-white text-xs p-2 rounded-lg text-text-main font-semibold"
                >
                  <option value={BSP_ROLLSCHUB.standard}>{inhalt.werte.bspRollschubStandard}</option>
                  <option value={BSP_ROLLSCHUB.proHolz}>{inhalt.werte.bspRollschubProHolz}</option>
                </select>
              </div>

              {/* Deckenbreite */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-text-main"><MdText text={inhalt.texte.bspDeckenbreite} /></label>
                <input aria-label={inhalt.werte.bspDeckenbreite}
                  type="number"
                  min="1"
                  max="20"
                  step="0.1"
                  value={vib.breite}
                  onChange={(e) => vib.setBreite(parseFloat(e.target.value))}
                  className="border border-home-grau/30 rounded-lg p-2 text-xs bg-white text-text-main font-bold"
                />
              </div>

              {/* Extra Mass */}
              <div className="flex flex-col gap-1 border-t border-home-grau/10 pt-2.5">
                <label className="text-xs font-bold text-text-main"><MdText text={inhalt.texte.zusatzmasseEstrichDämmungSchüttung} /></label>
                <input aria-label={inhalt.werte.zusatzmasseEstrichDämmungSchüttung}
                  type="number"
                  min="0"
                  max="400"
                  value={vib.extraMass}
                  onChange={(e) => vib.setExtraMass(parseFloat(e.target.value))}
                  className="border border-home-grau/30 rounded-lg p-2 text-xs bg-white text-text-main font-bold"
                />
                <p className="text-[10px] text-stone-500 leading-snug"><MdText text={inhalt.texte.tippEineSchwereZementschüttung} /></p>
              </div>

              {/* Estrich */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-text-main"><MdText text={inhalt.texte.bspEstrichDicke} /></label>
                  <input aria-label={inhalt.werte.bspEstrichDicke}
                    type="number"
                    min="0"
                    max="100"
                    value={vib.estrichDicke}
                    onChange={(e) => vib.setEstrichDicke(parseFloat(e.target.value))}
                    className="border border-home-grau/30 rounded-lg p-2 text-xs bg-white text-text-main font-bold"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-text-main"><MdText text={inhalt.texte.bspEstrichArt} /></label>
                  <select aria-label={inhalt.werte.bspEstrichArt}
                    value={vib.estrichArt}
                    onChange={(e) => vib.setEstrichArt(e.target.value as Estrichart)}
                    className="border border-home-grau/30 bg-white text-xs p-2 rounded-lg text-text-main font-semibold"
                  >
                    <option value="zement">{inhalt.werte.bspEstrichZement}</option>
                    <option value="anhydrit">{inhalt.werte.bspEstrichAnhydrit}</option>
                    <option value="gussasphalt">{inhalt.werte.bspEstrichGussasphalt}</option>
                  </select>
                </div>
              </div>
              <p className="text-[10px] text-stone-500 leading-snug"><MdText text={inhalt.texte.bspEstrichHinweis} /></p>
            </div>

            {/* Outputs (span 7) */}
            <div className="lg:col-span-12 xl:col-span-7 bg-blue-50/20 border border-blue-200/50 p-5 rounded-xl flex flex-col justify-between gap-4">
              <div>
                <span className="text-[10px] font-black uppercase text-blue-800 tracking-wider block mb-1"><MdText text={inhalt.texte.dynamischeEigenfrequenzermittlung} /></span>
                <h4 className="font-extrabold text-sm text-text-main"><MdText text={inhalt.texte.gebrauchstauglichkeitsnachweisEc5} /></h4>
              </div>

              <EingabeHinweise hinweise={vib.ergebnis.hinweise} />

              <div className="bg-white p-4 rounded-xl border border-home-grau/20 flex flex-col gap-3 shadow-xs text-xs">
                {/* Mass */}
                <div className="flex justify-between items-center text-text-main/80">
                  <span><MdText text={inhalt.texte.auswertbareDeckenEigenmasseG} /></span>
                  <span className="font-mono font-bold text-text-main">{formatDeZahl(vib.ergebnis.eigenmasse, 1)} kg/m²</span>
                </div>
                <div className="flex justify-between items-center text-text-main/80 border-b border-home-grau/10 pb-2">
                  <span><MdText text={inhalt.texte.gesamtmasseMTotInkl} /></span>
                  <span className="font-mono font-bold text-text-main">{formatDeZahl(vib.ergebnis.masse, 1)} kg/m²</span>
                </div>

                {/* Stiffness */}
                <div className="space-y-1 pt-1 text-[11px] leading-relaxed">
                  <span className="font-bold text-text-main block"><MdText text={inhalt.texte.biegesteifigkeitEiLPro} /></span>
                  <div className="bg-stone-50 p-1.5 rounded border font-mono flex flex-col gap-1">
                    <div className="flex justify-between gap-2"><span><MdText text={inhalt.texte.bspEiNetto} /></span><span>{formatDeZahl(vib.ergebnis.EI_l_netto / 1000, 0)} kNm²/m</span></div>
                    <div className="flex justify-between gap-2"><span><MdText text={inhalt.texte.bspEiGamma} /></span><span>{vib.ergebnis.EI_l_gamma === null ? '–' : `${formatDeZahl(vib.ergebnis.EI_l_gamma / 1000, 0)} kNm²/m (γ₁ = ${formatDeZahl(vib.ergebnis.gamma_aussen, 3)})`}</span></div>
                    <div className="flex justify-between gap-2"><span><MdText text={inhalt.texte.bspEiEstrich} /></span><span>{formatDeZahl(vib.ergebnis.EI_estrich / 1000, 0)} kNm²/m</span></div>
                    <div className="flex justify-between gap-2 font-bold"><span><MdText text={inhalt.texte.bspEiAngesetzt} /></span><span>{formatDeZahl(vib.ergebnis.EI_l / 1000, 0)} kNm²/m</span></div>
                    <div className="flex justify-between gap-2"><span><MdText text={inhalt.texte.bspEiQuer} /></span><span>{formatDeZahl(vib.ergebnis.EI_b_ges / 1000, 0)} kNm²/m</span></div>
                  </div>
                </div>

                {/* Formula f1 */}
                <div className="space-y-1 pt-1 text-[11px] leading-relaxed">
                  <span className="font-bold text-text-main block"><MdText text={inhalt.texte.grundfrequenzF1Einer} /></span>
                  <div className="bg-stone-50 p-1.5 rounded text-center border font-mono text-blue-900 font-bold text-xs">
                    <InlineMath math={`f_1 = \\frac{\\pi}{2 \\cdot \\ell^2} \\cdot \\sqrt{\\frac{(EI)_{\\ell}}{m}} = ${formatDeTeX(vib.ergebnis.f1, 2)}\\text{ Hz}`} />
                  </div>
                </div>

                {/* Steifigkeitskriterium */}
                <div className="space-y-1 pt-1 text-[11px] leading-relaxed">
                  <span className="font-bold text-text-main block"><MdText text={inhalt.texte.steifigkeitskriteriumW1kN} /></span>
                  <div className="bg-stone-50 p-1.5 rounded text-center border font-mono text-blue-900 text-xs flex flex-col gap-1">
                    <InlineMath math={`b_F = \\frac{\\ell}{1{,}1} \\cdot \\sqrt[4]{\\frac{(EI)_b}{(EI)_{\\ell}}} = ${formatDeTeX(vib.ergebnis.b_F, 2)}\\text{ m}, \\quad b_{ef} = ${formatDeTeX(vib.ergebnis.b_ef, 2)}\\text{ m}`} />
                    <InlineMath math={`w = \\frac{F \\cdot \\ell^3}{48 \\cdot (EI)_{\\ell} \\cdot b_{ef}} = ${formatDeTeX(vib.ergebnis.w1kN, 3)}\\text{ mm} \\quad (F = 1\\text{ kN})`} />
                  </div>
                </div>
              </div>

              {/* Neutrale Einordnung */}
              <div className="bg-white p-4 rounded-xl border border-home-grau/20 shadow-xs flex flex-col gap-2 text-xs">
                <span className="text-[10px] text-text-main/50 font-black uppercase tracking-wider block text-center"><MdText text={inhalt.texte.schwingungsnachweisKriterium80} /></span>
                <div className="flex justify-between items-center gap-3">
                  <span className="text-text-main/80">{vib.ergebnis.f1UeberAnwendungsgrenze ? inhalt.werte.bspF1Ueber8 : inhalt.werte.bspF1Bis8}</span>
                  <span className="font-mono text-base font-black text-text-main">{formatDeZahl(vib.ergebnis.f1, 2)} Hz</span>
                </div>
                <div className="flex justify-between items-center gap-3">
                  <span className="text-text-main/80">{vib.ergebnis.wUnterOrientierungI ? inhalt.werte.bspWBisI : vib.ergebnis.wUnterOrientierungII ? inhalt.werte.bspWBisII : inhalt.werte.bspWUeberII}</span>
                  <span className="font-mono text-base font-black text-text-main">{formatDeZahl(vib.ergebnis.w1kN, 2)} mm</span>
                </div>
                <p className="text-[10px] text-text-main/60 leading-relaxed"><MdText text={inhalt.texte.bspOrientierungNeutral} /></p>
                {!vib.ergebnis.f1UeberAnwendungsgrenze && (
                  <p className="text-[10px] text-rose-700 bg-rose-50 border border-rose-200 p-2 rounded-lg leading-relaxed"><MdText text={inhalt.texte.schwingungsgefahrDieFrequenzLiegt} /></p>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    );
}
