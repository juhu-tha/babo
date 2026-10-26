import { InlineMath } from 'react-katex';
import { GitCommit, Wrench } from 'lucide-react';
import { type Nutzungsklasse, type KLED } from '@/src/calc/holzbau';
import { formatDeZahl, formatDeWert, formatDeTeX } from '@/src/utils/numberFormat';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import type { Dispatch, SetStateAction } from 'react';
import inhalt from '@/content/holzbaubeta/HolzbauVerbindung.json';
import { MdText } from '@/src/components/inhalt/MdText';

interface HolzbauVerbindungProps {
  connAngle: number;
  connCount: number;
  connD: number;
  connForce: number;
  connLef: number;
  connLoadDuration: KLED;
  connResults: { k_mod: number; rho_k: number; factor_alpha: number; f_ax_alpha_k: number; F_ax_Rk_total_kN: number; F_ax_Rd_total_kN: number; f_h_k: number; M_y_Rk: number; rope_effect: number; F_v_Rk_total_kN: number; F_v_Rd_total_kN: number; utilAxial: number; utilShear: number; isAxialUnsafe: boolean; isShearUnsafe: boolean; };
  connServiceClass: Nutzungsklasse;
  connWoodClass: string;
  setConnAngle: Dispatch<SetStateAction<number>>;
  setConnCount: Dispatch<SetStateAction<number>>;
  setConnD: Dispatch<SetStateAction<number>>;
  setConnForce: Dispatch<SetStateAction<number>>;
  setConnLef: Dispatch<SetStateAction<number>>;
  setConnLoadDuration: Dispatch<SetStateAction<KLED>>;
  setConnServiceClass: Dispatch<SetStateAction<Nutzungsklasse>>;
  setConnWoodClass: Dispatch<SetStateAction<string>>;
}

export default function HolzbauVerbindung({ connAngle, connCount, connD, connForce, connLef, connLoadDuration, connResults, connServiceClass, connWoodClass, setConnAngle, setConnCount, setConnD, setConnForce, setConnLef, setConnLoadDuration, setConnServiceClass, setConnWoodClass }: HolzbauVerbindungProps) {
  return (
      <div className="flex flex-col gap-6 animate-in fade-in duration-300" id="holz_tab_connections">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="bg-white p-5 rounded-xl border border-home-grau/30 flex flex-col gap-3">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-800"><MdText text={inhalt.texte.stabScherverbindungen} /></span>
            <h3 className="font-extrabold text-text-main text-base"><MdText text={inhalt.texte.stabdübelUndBolzenanschlüsse} /></h3>
            <p className="text-xs text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.klassischeIngenieurmäßigeVerbindungstech} /></p>
            <div className="text-[11px] font-medium leading-normal bg-amber-50 p-3 rounded-lg border border-amber-100/50 mt-2"><MdText text={inhalt.texte.anordnungsregelDinEn1995} /></div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-home-grau/30 flex flex-col gap-3">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-800">Holzbauschrauben</span>
            <h3 className="font-extrabold text-text-main text-base"><MdText text={inhalt.texte.vollgewindeschraubenZugverbindungen} /></h3>
            <p className="text-xs text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.vollgewindeschraubenSindImBrettsperrholz} /></p>
            <div className="text-[11px] font-medium leading-normal bg-amber-50 p-3 rounded-lg border border-amber-100/50 mt-2"><MdText text={inhalt.texte.ingenieurvorteilSchnelleMontageIn} /></div>
          </div>

        </div>

        {/* Interactive Johansen failure modes visualizer */}
        <div className="bg-white p-5 rounded-xl border border-home-grau/30 flex flex-col gap-4">
          <h3 className="font-black text-sm text-text-main flex items-center gap-2 border-b border-home-grau/20 pb-2">
            <GitCommit size={16} className="text-amber-800" /><MdText text={inhalt.texte.johansenVersagensmechanismenInEinschnitt} /></h3>

          <p className="text-xs text-text-main/70 max-w-3xl"><MdText text={inhalt.texte.eurocode5UnterscheidetMathematisch} /></p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
            <div className="border border-home-grau/20 p-4 rounded-xl bg-off-white text-center flex flex-col items-center gap-2">
              <span className="text-[10px] uppercase tracking-wider text-danger font-bold block"><MdText text={inhalt.texte.modusAReineLeibung} /></span>
              <span className="w-12 h-16 bg-[#e2e8f0] border-2 border-amber-800/40 relative flex items-center justify-center rounded">
                <span className="absolute w-2 h-14 bg-stone-700/80 -rotate-3" />
              </span>
              <p className="text-[11px] text-text-main/60 mt-1 leading-normal"><MdText text={inhalt.texte.holzLeibtLokalKomplett} /></p>
            </div>

            <div className="border border-home-grau/20 p-4 rounded-xl bg-off-white text-center flex flex-col items-center gap-2">
              <span className="text-[10px] uppercase tracking-wider text-amber-800 font-bold block"><MdText text={inhalt.texte.modusBEinFließgelenk} /></span>
              <span className="w-12 h-16 bg-[#e2e8f0] border-2 border-amber-800/40 relative flex items-center justify-center rounded">
                <span className="absolute w-2 h-14 bg-stone-700/80 skew-x-12" />
              </span>
              <p className="text-[11px] text-text-main/60 mt-1 leading-normal"><MdText text={inhalt.texte.derVerbindungsbolzenVerformtSich} /></p>
            </div>

            <div className="border border-home-grau/20 p-4 rounded-xl bg-off-white text-center flex flex-col items-center gap-2">
              <span className="text-[10px] uppercase tracking-wider text-emerald-800 font-bold block"><MdText text={inhalt.texte.modusCZweiFließgelenke} /></span>
              <span className="w-12 h-16 bg-[#e2e8f0] border-2 border-amber-800/40 relative flex items-center justify-center rounded">
                <span className="absolute w-2 h-14 bg-stone-700/80 rounded" style={{ transform: 'rotate(10deg) skewY(15deg)' }} />
              </span>
              <p className="text-[11px] text-text-main/60 mt-1 leading-normal"><MdText text={inhalt.texte.imStiftBildenSich} /></p>
            </div>
          </div>

        </div>

        {/* NEW INTERACTIVE: Schrauben-Berechnung nach EC5 Abs. 8.7 */}
        <div className="bg-white p-6 rounded-xl border border-home-grau/30 flex flex-col gap-5">
          <div>
            <span className="text-xs uppercase font-black text-amber-800 tracking-wider"><MdText text={inhalt.texte.verbindungsmittelprüfungIngenieurpraxis} /></span>
            <h3 className="font-extrabold text-text-main text-base mt-1 flex items-center gap-2">
              <Wrench size={20} className="text-amber-800" /><MdText text={inhalt.texte.vollgewindeschraubenGrenztragfähigkeitsr} /></h3>
            <p className="text-xs text-text-main/70 leading-relaxed mt-1"><MdText text={inhalt.texte.berechnenSieDieCharakt} /></p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column Controls (span 5) */}
            <div className="lg:col-span-5 flex flex-col gap-4 bg-off-white p-4 rounded-xl border border-home-grau/20">
              <h4 className="font-bold text-xs uppercase tracking-wider text-text-main">Verbindungs-Parameter</h4>

              {/* Wood density selector */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-text-main"><MdText text={inhalt.texte.gegenholzMaterialklasseDichte} /></label>
                <select aria-label={inhalt.werte.gegenholzMaterialklasseDichte}
                  value={connWoodClass}
                  onChange={(e) => setConnWoodClass(e.target.value)}
                  className="border border-home-grau/30 bg-white text-xs p-2 rounded-lg text-text-main font-semibold"
                >
                  <option value="C24">KVH / Vollholz C24 (ρ_k = 350 kg/m³)</option>
                  <option value="C30">Nadelholz C30 (ρ_k = 380 kg/m³)</option>
                  <option value="D30">Laubholz D30 (Buche/Eiche) (ρ_k = 530 kg/m³)</option>
                  <option value="D40">Laubholz D40 (ρ_k = 550 kg/m³)</option>
                  <option value="GL24h">BSH GL24h (ρ_k = 385 kg/m³)</option>
                  <option value="GL30h">BSH GL30h (ρ_k = 430 kg/m³)</option>
                </select>
              </div>

              {/* Screw Dimensions */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-text-main"><MdText text={inhalt.texte.schraubenDurchmDMm} /></label>
                  <select aria-label={inhalt.werte.schraubenDurchmDMm}
                    value={connD}
                    onChange={(e) => setConnD(parseInt(e.target.value) || 8)}
                    className="border border-home-grau/30 bg-white text-xs p-1.5 rounded-lg text-text-main font-semibold"
                  >
                    <option value={6}>d = 6,0 mm (Spax)</option>
                    <option value={8}>d = 8,0 mm (Standard Holzbau)</option>
                    <option value={10}>d = 10,0 mm (Schwerlast)</option>
                    <option value={12}>d = 12,0 mm (Extrem-Träger)</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-text-main"><MdText text={inhalt.texte.gewindelängeLEfMm} /></label>
                  <input aria-label={inhalt.werte.gewindelängeLEfMm}
                    type="number"
                    min="40"
                    max="300"
                    value={connLef}
                    onChange={(e) => setConnLef(Math.max(40, parseInt(e.target.value) || 40))}
                    className="border border-home-grau/30 rounded-lg p-2 text-xs bg-white text-text-main font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-text-main"><MdText text={inhalt.texte.eindrehwinkel} /></label>
                  <select aria-label={inhalt.werte.eindrehwinkel}
                    value={connAngle}
                    onChange={(e) => setConnAngle(parseInt(e.target.value) || 90)}
                    className="border border-home-grau/30 bg-white text-xs p-1.5 rounded-lg text-text-main"
                  >
                    <option value={90}>90° (Rechtwinklig)</option>
                    <option value={45}>45° (Schrägverschraubung)</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-text-main"><MdText text={inhalt.texte.schraubenanzahlN} /></label>
                  <input aria-label={inhalt.werte.schraubenanzahlN}
                    type="number"
                    min="1"
                    max="48"
                    value={connCount}
                    onChange={(e) => setConnCount(Math.max(1, parseInt(e.target.value) || 1))}
                    className="border border-home-grau/30 rounded-lg p-2 text-xs bg-white text-text-main font-bold"
                  />
                </div>
              </div>

              {/* NKL / KLED → k_mod */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-text-main"><MdText text={inhalt.texte.nutzungsklasseVerbindung} /></label>
                  <select aria-label={inhalt.werte.nutzungsklasseDerVerbindung}
                    value={connServiceClass}
                    onChange={(e) => setConnServiceClass(Number(e.target.value) as Nutzungsklasse)}
                    className="border border-home-grau/30 bg-white text-xs p-1.5 rounded-lg text-text-main"
                  >
                    <option value={1}>NKL 1</option>
                    <option value={2}>NKL 2</option>
                    <option value={3}>NKL 3</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-text-main"><MdText text={inhalt.texte.kledVerbindung} /></label>
                  <select aria-label={inhalt.werte.kledDerVerbindung}
                    value={connLoadDuration}
                    onChange={(e) => setConnLoadDuration(e.target.value as KLED)}
                    className="border border-home-grau/30 bg-white text-xs p-1.5 rounded-lg text-text-main"
                  >
                    <option value="stnd">ständig</option>
                    <option value="lg">lang</option>
                    <option value="mtl">mittel</option>
                    <option value="krt">kurz</option>
                    <option value="sfs">sehr kurz</option>
                  </select>
                </div>
                <p className="col-span-2 text-[10px] text-text-main/60 leading-snug">k<sub>mod</sub> = {formatDeZahl(connResults.k_mod, 2)}<MdText text={inhalt.texte.nachDinEn1995} /></p>
              </div>

              {/* Load */}
              <div className="flex flex-col gap-1 border-t border-home-grau/10 pt-2.5">
                <label className="text-xs font-bold text-rose-800"><MdText text={inhalt.texte.bemessungseinwirkungVEdKn} /></label>
                <div className="relative">
                  <input aria-label={inhalt.werte.bemessungseinwirkungVEdKn}
                    type="number" min="0"
                    value={connForce}
                    onChange={(e) => setConnForce(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full border border-home-grau/30 rounded-lg p-2 text-xs bg-white text-text-main font-black"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 font-mono text-[10px] text-text-main/50 font-bold">kN</span>
                </div>
                <p className="text-[10px] text-text-main/60 leading-snug"><MdText text={inhalt.texte.vereinfachungDerselbeWertWird} /></p>
              </div>
            </div>

            {/* Right Column Results (span 7) */}
            <div className="lg:col-span-7 bg-amber-50/20 border border-amber-200/50 p-5 rounded-xl flex flex-col justify-between gap-4">
              <div>
                <span className="text-[10px] font-black uppercase text-amber-800 tracking-wider block mb-1">Verbindungskennwerte</span>
                <h4 className="font-extrabold text-sm text-text-main"><MdText text={inhalt.texte.tragwiderständeNachErsatzformelnEurocode} /></h4>
              </div>

              <div className="bg-white p-4 rounded-xl border border-home-grau/20 flex flex-col gap-3 shadow-xs text-xs">
                {/* Pullout resistance */}
                <div className="space-y-1">
                  <span className="font-black text-text-main flex justify-between items-center bg-off-white px-2 py-1 rounded">
                    <span><MdText text={inhalt.texte.aAxialerAusziehwiderstandF} /></span>
                    <span className="font-mono text-emerald-800">{formatDeZahl(connResults.F_ax_Rd_total_kN, 1)} kN</span>
                  </span>
                  <p className="text-[10px] text-text-main/60 pl-2 leading-relaxed"><MdText text={inhalt.texte.erhöhteAuszugsfestigkeitDankDichteverhäl} />{formatDeWert(connAngle)}° beträgt <span className="font-bold">{formatDeZahl(connResults.factor_alpha, 3)}</span>{connResults.factor_alpha < 1 ? inhalt.werte.abminderungGegenüber90 : ''}.
                  </p>
                </div>

                {/* Shear resistance */}
                <div className="space-y-1 border-t border-home-grau/10 pt-2">
                  <span className="font-black text-text-main flex justify-between items-center bg-off-white px-2 py-1 rounded">
                    <span><MdText text={inhalt.texte.bSchertragfähigkeitFV} /></span>
                    <span className="font-mono text-emerald-800">{formatDeZahl(connResults.F_v_Rd_total_kN, 1)} kN</span>
                  </span>
                  <p className="text-[10px] text-text-main/60 pl-2 leading-relaxed"><MdText text={inhalt.texte.lochleibungswiderstandDesHolzesF} />{formatDeZahl(connResults.f_h_k, 1)}<MdText text={inhalt.texte.nMmMitZusätzlichem} />{formatDeZahl(connResults.rope_effect, 0)} N.
                  </p>
                </div>
              </div>

              {/* Gauges */}
              <div className="grid grid-cols-2 gap-4">
                {/* Gauge Axial */}
                <div className="bg-white p-3 rounded-xl border border-home-grau/15">
                  <span className="text-[10px] text-text-main/50 font-black block text-center uppercase tracking-wider"><MdText text={inhalt.texte.ausnutzungAxial} /></span>
                  <span className={`text-base font-black font-mono block text-center mt-1 py-0.5 rounded ${
                      connResults.isAxialUnsafe ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                    {formatDeZahl(connResults.utilAxial, 1)}%
                  </span>
                  <div className="w-full bg-home-grau/15 h-2 rounded-full overflow-hidden mt-1.5">
                    <div
                      className={`h-full rounded-full ${connResults.isAxialUnsafe ? 'bg-rose-600' : 'bg-emerald-500'}`}
                      style={{ width: `${Math.min(100, connResults.utilAxial)}%` }}
                    />
                  </div>
                </div>

                {/* Gauge Shear */}
                <div className="bg-white p-3 rounded-xl border border-home-grau/15">
                  <span className="text-[10px] text-text-main/50 font-black block text-center uppercase tracking-wider"><MdText text={inhalt.texte.ausnutzungScherung} /></span>
                  <span className={`text-base font-black font-mono block text-center mt-1 py-0.5 rounded ${
                      connResults.isShearUnsafe ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                    {formatDeZahl(connResults.utilShear, 1)}%
                  </span>
                  <div className="w-full bg-home-grau/15 h-2 rounded-full overflow-hidden mt-1.5">
                    <div
                      className={`h-full rounded-full ${connResults.isShearUnsafe ? 'bg-rose-600' : 'bg-emerald-500'}`}
                      style={{ width: `${Math.min(100, connResults.utilShear)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* General Status message */}
              {(connResults.isAxialUnsafe || connResults.isShearUnsafe) ? (
                <div className="bg-rose-50 border border-rose-200 text-rose-900 p-2 text-[10px] rounded-lg leading-snug"><MdText text={inhalt.texte.tragfähigkeitNichtAusreichendDurchmesser} /></div>
              ) : (
                <div className="bg-emerald-50 border border-emerald-100 text-emerald-900 p-2 text-[10px] rounded-lg leading-snug"><MdText text={inhalt.texte.nachweisImLehrmodellErfüllt} /></div>
              )}

              <FormulaDerivationBox
                live
                title={inhalt.werte.ihrRechenwegSchraubenverbindungMit}
                zielGleichung={`F_{v,Rd} = \\frac{k_{mod} \\cdot n \\cdot F_{v,Rk}}{\\gamma_M} = ${formatDeTeX(connResults.F_v_Rd_total_kN, 1)}\\,\\text{kN};\\quad F_{ax,Rd} = ${formatDeTeX(connResults.F_ax_Rd_total_kN, 1)}\\,\\text{kN}`}
                normQuelle={inhalt.werte.dinEn19951}
                schritte={[
                  {
                    titel: 'Ausziehfestigkeit',
                    erklaerung: `Lehrwert f_ax,k = 12 N/mm², Rohdichte ρ_k = ${formatDeZahl(connResults.rho_k, 0)} kg/m³, Einschraubwinkel ${formatDeZahl(connAngle, 0)}°.`,
                    formel: `f_{ax,\\alpha,k} = 12 \\cdot ${formatDeTeX(connResults.factor_alpha, 3)} \\cdot \\left(\\frac{${formatDeTeX(connResults.rho_k, 0)}}{350}\\right)^{0{,}8} = ${formatDeTeX(connResults.f_ax_alpha_k, 2)}\\,\\text{N/mm}^2`,
                  },
                  {
                    titel: inhalt.werte.ausziehwiderstandDerGruppe,
                    erklaerung: `Lehrmodell mit k_mod = ${formatDeZahl(connResults.k_mod, 2)} (NKL ${formatDeZahl(connServiceClass, 0)}, KLED gewählt) und γ_M = 1,3, ohne wirksame Anzahl n_ef.`,
                    formel: `F_{ax,Rd} = \\frac{${formatDeTeX(connResults.k_mod, 2)} \\cdot ${formatDeTeX(connCount, 0)} \\cdot ${formatDeTeX(connResults.f_ax_alpha_k, 2)} \\cdot ${formatDeTeX(connD, 0)} \\cdot ${formatDeTeX(connLef, 0)}}{1{,}3} \\cdot 10^{-3} = ${formatDeTeX(connResults.F_ax_Rd_total_kN, 1)}\\,\\text{kN}`,
                  },
                  {
                    titel: inhalt.werte.lochleibungsfestigkeitUndFließmoment,
                    erklaerung: inhalt.werte.lochleibungsfestigkeitNachEc5Ansatz,
                    formel: `f_{h,k} = 0{,}082 \\cdot (1 - 0{,}01 \\cdot ${formatDeTeX(connD, 0)}) \\cdot ${formatDeTeX(connResults.rho_k, 0)} = ${formatDeTeX(connResults.f_h_k, 2)}\\,\\text{N/mm}^2;\\quad M_{y,Rk} = 0{,}3 \\cdot 400 \\cdot ${formatDeTeX(connD, 0)}^{2{,}6} = ${formatDeTeX(connResults.M_y_Rk, 0)}\\,\\text{Nmm}`,
                  },
                  {
                    titel: inhalt.werte.schertragfähigkeitJeSchraube,
                    erklaerung: `Kleinerer Wert aus Lochleibungsversagen und Fließgelenk-Mechanismus mit Seileffekt (${formatDeZahl(connResults.rope_effect, 0)} N).`,
                    formel: `F_{v,Rk} = \\min(${formatDeTeX(connResults.f_h_k * connLef * connD, 0)};\\; ${formatDeTeX(1.15 * Math.sqrt(2 * connResults.M_y_Rk * connResults.f_h_k * connD), 0)} + ${formatDeTeX(connResults.rope_effect, 0)}) = ${formatDeTeX((connResults.F_v_Rk_total_kN * 1000) / connCount, 0)}\\,\\text{N}`,
                  },
                  {
                    titel: inhalt.werte.bemessungswerteUndAusnutzung,
                    erklaerung: `V_Ed = ${formatDeZahl(connForce, 1)} kN wird vereinfacht beiden Nachweisen getrennt gegenübergestellt (keine kombinierte Beanspruchung nach 8.7.3).`,
                    formel: `F_{v,Rd} = \\frac{${formatDeTeX(connResults.k_mod, 2)} \\cdot ${formatDeTeX(connResults.F_v_Rk_total_kN, 2)}}{1{,}3} = ${formatDeTeX(connResults.F_v_Rd_total_kN, 1)}\\,\\text{kN};\\quad \\eta_v = ${formatDeTeX(connResults.utilShear, 1)}\\,\\%,\\; \\eta_{ax} = ${formatDeTeX(connResults.utilAxial, 1)}\\,\\%`,
                  },
                ]}
                ergebnisHinweis={`Ausnutzung Scherung ${formatDeZahl(connResults.utilShear, 1)} %, axial ${formatDeZahl(connResults.utilAxial, 1)} %`}
              />
            </div>
          </div>
        </div>

      </div>
    );
}
