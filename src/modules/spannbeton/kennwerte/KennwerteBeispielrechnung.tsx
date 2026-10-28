import { Calculator, Activity, Building, Zap, Clock, CheckCircle2 } from 'lucide-react';
import { formatDeWert, formatDeZahl, formatDeTeXWert } from '@/src/utils/numberFormat';
import { InlineMath, BlockMath } from 'react-katex';
import type { Dispatch, SetStateAction } from 'react';
import inhalt from '@/content/spannbeton/kennwerte/KennwerteBeispielrechnung.json';
import { MdText } from '@/src/components/inhalt/MdText';

interface KennwerteBeispielrechnungProps {
  exCalc: { Ap: number; Ac: number; Ic: number; ep: number; Ep: number; fpk: number; sigma_p0: number; immediateLosses: number; sigma_pm0: number; Pm0: number; sig_c_p0: number; phi: number; eps_cs: number; eps_ca: number; eps_cd: number; delta_sig_pr: number; term_schwinden: number; term_kriechen: number; term_relaxation: number; zaehler: number; k_geom: number; nenner: number; delta_sig_csr: number; sigma_pminf: number; Pminf: number; delta_P_total: number; loss_pct: number; };
  exConc: { fck: number; fcm: number; Ecm: number; alpha_p: number; };
  exConcreteClass: "C45/55" | "C35/45" | "C70/85";
  exP0: number;
  exSpanRH: number;
  exSpanT0: number;
  setExConcreteClass: Dispatch<SetStateAction<"C45/55" | "C35/45" | "C70/85">>;
  setExP0: Dispatch<SetStateAction<number>>;
  setExSpanRH: Dispatch<SetStateAction<number>>;
  setExSpanT0: Dispatch<SetStateAction<number>>;
}

export default function KennwerteBeispielrechnung({ exCalc, exConc, exConcreteClass, exP0, exSpanRH, exSpanT0, setExConcreteClass, setExP0, setExSpanRH, setExSpanT0 }: KennwerteBeispielrechnungProps) {
  return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-home-grau/15 pb-4">
            <div>
              <h4 className="text-base font-bold text-text-main flex items-center gap-2">
                <Calculator className="text-shiraz h-5 w-5" /><MdText text={inhalt.texte.musterrechnungNachDinEn} /></h4>
              <p className="text-xs text-text-main/70 mt-1"><MdText text={inhalt.texte.vollständigesVerifiziertesZahlenbeispiel} /></p>
            </div>
            <span className="self-start sm:self-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              Praxis-Zahlenbeispiel
            </span>
          </div>

          {/* Interaktive Parameter-Leiste */}
          <div className="p-4 bg-off-white/80 rounded-2xl border border-home-grau/30 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Activity size={14} className="text-shiraz" /><MdText text={inhalt.texte.echtzeitParameterDerBeispielrechnung} /></span>
              <span className="text-[11px] text-slate-500 font-medium"><MdText text={inhalt.texte.verändereDieParameterUm} /></span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              {/* 1. Betonfestigkeitsklasse */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">Betonklasse:</label>
                <select aria-label="Betonklasse"
                  value={exConcreteClass}
                  onChange={(e) => setExConcreteClass(e.target.value as "C45/55" | "C35/45" | "C70/85")}
                  className="w-full p-2 border border-home-grau/30 rounded-lg bg-white font-medium font-mono"
                >
                  <option value="C35/45">C35/45 (Ecm = 34 000 MPa)</option>
                  <option value="C45/55">C45/55 (Standard, Ecm = 36 000 MPa)</option>
                  <option value="C70/85">C70/85 (Hochfest, Ecm = 41 000 MPa)</option>
                </select>
              </div>

              {/* 2. Spannalter t_0 */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block"><MdText text={inhalt.texte.spannalterTTage} /></label>
                <select aria-label={inhalt.werte.spannalterTTage}
                  value={exSpanT0}
                  onChange={(e) => setExSpanT0(Number(e.target.value))}
                  className="w-full p-2 border border-home-grau/30 rounded-lg bg-white font-medium font-mono"
                >
                  <option value={3}>3 Tage (sehr frühes Spannen)</option>
                  <option value={7}>7 Tage (Fertigteilwerk Standard)</option>
                  <option value={14}>14 Tage (Baustellenvorspannung)</option>
                  <option value={28}>28 Tage (spätes Spannen)</option>
                </select>
              </div>

              {/* 3. Umgebungsfeuchte RH */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block"><MdText text={inhalt.texte.relativeLuftfeuchteRh} /></label>
                <select aria-label={inhalt.werte.relativeLuftfeuchteRh}
                  value={exSpanRH}
                  onChange={(e) => setExSpanRH(Number(e.target.value))}
                  className="w-full p-2 border border-home-grau/30 rounded-lg bg-white font-medium font-mono"
                >
                  <option value={50}>RH = 50 % (Trockenes Innenklima)</option>
                  <option value={70}>RH = 70 % (Außenklima Standard)</option>
                  <option value={85}>RH = 85 % (Sehr feuchtes Klima / Küste)</option>
                </select>
              </div>

              {/* 4. Nenn-Vorspannkraft P_0 */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block"><MdText text={inhalt.texte.nennkraftPAnPresse} /></label>
                <select aria-label={inhalt.werte.nennkraftPAnPresse}
                  value={exP0}
                  onChange={(e) => setExP0(Number(e.target.value))}
                  className="w-full p-2 border border-home-grau/30 rounded-lg bg-white font-medium font-mono"
                >
                  <option value={3800}>3800 kN (moderate Ausnutzung)</option>
                  <option value={4500}>4500 kN (σ_p0 = 1250 MPa)</option>
                  <option value={5000}>5000 kN (Standard, σ_p0 ≈ 1390 MPa)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Bauteil-Steckbrief & Geometrie */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <span className="font-bold text-slate-800 uppercase tracking-wider block flex items-center gap-1.5">
                <Building size={14} className="text-shiraz" /><MdText text={inhalt.texte.t1TragwerkQuerschnitt} /></span>
              <div className="space-y-1 text-text-main/80 font-mono">
                <div className="flex justify-between"><span><MdText text={inhalt.texte.stützweiteL} /></span><span className="font-bold">24,00 m</span></div>
                <div className="flex justify-between"><span><MdText text={inhalt.texte.betonflächeAc} /></span><span className="font-bold">500 000 mm²</span></div>
                <div className="flex justify-between"><span><MdText text={inhalt.texte.trägheitsmomentIc} /></span><span className="font-bold"><MdText text={inhalt.texte.t85010Mm} /></span></div>
                <div className="flex justify-between"><span><MdText text={inhalt.texte.exzentrizitätEp} /></span><span className="font-bold"><MdText text={inhalt.texte.t450MmMitte} /></span></div>
                <div className="flex justify-between"><span><MdText text={inhalt.texte.eigengewichtG} /></span><span className="font-bold">12,5 kN/m</span></div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <span className="font-bold text-slate-800 uppercase tracking-wider block flex items-center gap-1.5">
                <Zap size={14} className="text-shiraz" /><MdText text={inhalt.texte.t2SpanngliederStahl} /></span>
              <div className="space-y-1 text-text-main/80 font-mono">
                <div className="flex justify-between"><span>Spannstahl:</span><span className="font-bold"><MdText text={inhalt.texte.y1860S7157} /></span></div>
                <div className="flex justify-between"><span><MdText text={inhalt.texte.anzahlLitzen} /></span><span className="font-bold"><MdText text={inhalt.texte.t21224Litzen} /></span></div>
                <div className="flex justify-between"><span><MdText text={inhalt.texte.spannstahlflächeAp} /></span><span className="font-bold">3600 mm²</span></div>
                <div className="flex justify-between"><span>E-Modul Ep:</span><span className="font-bold"><MdText text={inhalt.texte.t195000NMm} /></span></div>
                <div className="flex justify-between"><span><MdText text={inhalt.texte.zugfestigkeitFpk} /></span><span className="font-bold">1860 N/mm²</span></div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <span className="font-bold text-slate-800 uppercase tracking-wider block flex items-center gap-1.5">
                <Clock size={14} className="text-shiraz" /><MdText text={inhalt.texte.t3UnmittelbareVerlusteT} /></span>
              <div className="space-y-1 text-text-main/80 font-mono">
                <div className="flex justify-between"><span><MdText text={inhalt.texte.nennvorspannungP0} /></span><span className="font-bold">{formatDeWert(exCalc.sigma_p0)} N/mm²</span></div>
                <div className="flex justify-between"><span><MdText text={inhalt.texte.reibungSchlupfEl} /></span><span className="font-bold text-amber-700">-{formatDeWert(exCalc.immediateLosses)} N/mm²</span></div>
                <div className="flex justify-between"><span><MdText text={inhalt.texte.initialspannungPm0} /></span><span className="font-bold text-slate-900">{formatDeWert(exCalc.sigma_pm0)} N/mm²</span></div>
                <div className="flex justify-between"><span><MdText text={inhalt.texte.initialkraftPm0} /></span><span className="font-bold text-slate-900">{formatDeWert(exCalc.Pm0)} kN</span></div>
                <div className="flex justify-between"><span><MdText text={inhalt.texte.ausnutzungPm0Fpk} /></span><span className="font-bold">{formatDeZahl((exCalc.sigma_pm0 / 1860), 2)}</span></div>
              </div>
            </div>
          </div>

          {/* Schritt 1: Betonspannung in Spanngliedhöhe */}
          <div className="p-4 bg-white rounded-xl border border-home-grau/30 shadow-xs space-y-3">
            <h5 className="font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" /><MdText text={inhalt.texte.schritt1BetonspannungIn} /></h5>
            <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.zurErmittlungDesKriechverlusts} /></p>
            <div className="p-3 bg-off-white/80 rounded-lg border border-home-grau/20 text-center font-mono text-xs overflow-x-auto">
              <BlockMath math={`\\sigma_{c,QP} = \\frac{P_{m0}}{A_c} + \\frac{P_{m0} \\cdot e_p^2}{I_c} - \\frac{M_g \\cdot e_p}{I_c} = \\frac{${formatDeTeXWert((exCalc.Pm0 * 1000))}}{500\\,000} + \\frac{${formatDeTeXWert((exCalc.Pm0 * 1000))} \\cdot 450^2}{8{,}5 \\cdot 10^{10}} - \\frac{900 \\cdot 10^6 \\cdot 450}{8{,}5 \\cdot 10^{10}} = ${exCalc.sig_c_p0}\\text{ N/mm}^2`} />
            </div>
            <div className="grid grid-cols-3 gap-2 text-[11px] text-center text-slate-600 pt-1">
              <div className="p-1.5 bg-slate-50 rounded border"><MdText text={inhalt.texte.normalkraftanteil} />{formatDeZahl(((exCalc.Pm0 * 1000) / 500000), 2)} N/mm²</div>
              <div className="p-1.5 bg-slate-50 rounded border"><MdText text={inhalt.texte.vorspannMoment} />{formatDeZahl(((exCalc.Pm0 * 1000 * 450 * 450) / 8.5e10), 2)} N/mm²</div>
              <div className="p-1.5 bg-slate-50 rounded border"><MdText text={inhalt.texte.eigengewichtsentlastung476N} /></div>
            </div>
          </div>

          {/* Schritt 2: Die 3 zeitabhängigen Materialkennwerte */}
          <div className="space-y-3">
            <h5 className="font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" /><MdText text={inhalt.texte.schritt2DieDrei} /></h5>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Kriechzahl */}
              <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200/80 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <strong className="text-amber-900 font-bold uppercase tracking-wider"><MdText text={inhalt.texte.t1KriechzahlT} /></strong>
                  <span className="font-mono font-bold text-amber-950 text-base">{formatDeWert(exCalc.phi)}</span>
                </div>
                <p className="text-amber-950/80 leading-relaxed text-[11px]"><MdText text={inhalt.texte.berechnetNachDinEn} />{formatDeWert(exSpanT0)}<MdText text={inhalt.texte.dZementRUnd} />{formatDeWert(exSpanRH)} %.
                </p>
                <div className="p-2 bg-white rounded border border-amber-200 text-center font-mono font-bold text-amber-900">
                  φ(∞, {formatDeWert(exSpanT0)}) = {formatDeWert(exCalc.phi)}
                </div>
              </div>

              {/* Schwindmaß */}
              <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-200/80 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <strong className="text-blue-900 font-bold uppercase tracking-wider"><MdText text={inhalt.texte.t2EndschwindmaßCs} /></strong>
                  <span className="font-mono font-bold text-blue-950 text-base">{formatDeZahl((exCalc.eps_cs * 1000), 2)} mm/m</span>
                </div>
                <p className="text-blue-950/80 leading-relaxed text-[11px]"><MdText text={inhalt.texte.summeAusAutogenemSchwinden} />{formatDeWert(exCalc.eps_ca)}<MdText text={inhalt.texte.mmMUndTrocknungsschwinden} />{formatDeWert(exCalc.eps_cd)}<MdText text={inhalt.texte.mmMNachGl} /></p>
                <div className="p-2 bg-white rounded border border-blue-200 text-center font-mono font-bold text-blue-900">
                  ε_cs(∞) = {formatDeZahl((exCalc.eps_cs * 1000), 3)} · 10⁻³
                </div>
              </div>

              {/* Relaxation */}
              <div className="p-4 bg-purple-50/60 rounded-xl border border-purple-200/80 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <strong className="text-purple-900 font-bold uppercase tracking-wider"><MdText text={inhalt.texte.t3StahlrelaxationPr} /></strong>
                  <span className="font-mono font-bold text-purple-950 text-base">{formatDeWert(exCalc.delta_sig_pr)} N/mm²</span>
                </div>
                <p className="text-purple-950/80 leading-relaxed text-[11px]"><MdText text={inhalt.texte.t1000StundenReferenzrelaxationNach} />{formatDeZahl((exCalc.sigma_pm0 / 1860), 2)}.
                </p>
                <div className="p-2 bg-white rounded border border-purple-200 text-center font-mono font-bold text-purple-900">
                  Δσ_pr = {formatDeWert(exCalc.delta_sig_pr)} N/mm²
                </div>
              </div>
            </div>
          </div>

          {/* Schritt 3: Kopplungsformel DIN EN 1992-1-1 Gl. (5.46) */}
          <div className="p-5 bg-white rounded-2xl border border-home-grau/30 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-home-grau/15 pb-2">
              <h5 className="font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" /><MdText text={inhalt.texte.schritt3EinsetzenIn} /></h5>
              <span className="text-[11px] font-mono text-shiraz font-bold"><MdText text={inhalt.texte.dinEn19921} /></span>
            </div>

            {/* Formelbox mit weißem Hintergrund */}
            <div className="p-4 bg-white rounded-xl border border-home-grau/30 text-center overflow-x-auto">
              <BlockMath math="\Delta\sigma_{p,c+s+r} = \frac{\varepsilon_{cs} \cdot E_p + 0{,}8 \cdot \Delta\sigma_{pr} + \frac{E_p}{E_{cm}} \cdot \varphi(t, t_0) \cdot \sigma_{c,QP}}{1 + \frac{E_p}{E_{cm}} \cdot \frac{A_p}{A_c} \cdot \left(1 + \frac{A_c \cdot e_p^2}{I_c}\right) \cdot \left(1 + 0{,}8 \cdot \varphi(t, t_0)\right)}" />
            </div>

            {/* Aufschlüsselung Zähler & Nenner */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Zähler-Berechnung */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
                <span className="font-bold text-slate-800 block text-xs uppercase tracking-wide"><MdText text={inhalt.texte.derZählerAntreibendePrimärverluste} /></span>
                <div className="space-y-1.5 font-mono text-[11px]">
                  <div className="flex justify-between p-1.5 bg-white rounded border border-slate-200">
                    <span><MdText text={inhalt.texte.t1SchwindanteilCsEp} /></span>
                    <span className="font-bold text-blue-700">+{formatDeWert(exCalc.term_schwinden)} N/mm²</span>
                  </div>
                  <div className="flex justify-between p-1.5 bg-white rounded border border-slate-200">
                    <span><MdText text={inhalt.texte.t2KriechanteilPCp0} /></span>
                    <span className="font-bold text-amber-700">+{formatDeWert(exCalc.term_kriechen)} N/mm²</span>
                  </div>
                  <div className="flex justify-between p-1.5 bg-white rounded border border-slate-200">
                    <span><MdText text={inhalt.texte.t3GedämpfteRelaxation0} /></span>
                    <span className="font-bold text-purple-700">+{formatDeWert(exCalc.term_relaxation)} N/mm²</span>
                  </div>
                  <div className="flex justify-between p-2 bg-slate-100 rounded border border-slate-300 font-bold text-xs">
                    <span>ZÄHLER-SUMME:</span>
                    <span className="text-slate-900">{formatDeWert(exCalc.zaehler)} N/mm²</span>
                  </div>
                </div>
              </div>

              {/* Nenner-Berechnung */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
                <span className="font-bold text-slate-800 block text-xs uppercase tracking-wide"><MdText text={inhalt.texte.derNennerRückstellendeSystemsteifigkeit} /></span>
                <div className="space-y-1.5 font-mono text-[11px]">
                  <div className="flex justify-between p-1.5 bg-white rounded border border-slate-200">
                    <span><MdText text={inhalt.texte.modulverhältnisPEpEcm} /></span>
                    <span className="font-bold">{formatDeZahl(exConc.alpha_p, 3)}</span>
                  </div>
                  <div className="flex justify-between p-1.5 bg-white rounded border border-slate-200">
                    <span><MdText text={inhalt.texte.geometriefaktor1AcEp} /></span>
                    <span className="font-bold">{formatDeWert(exCalc.k_geom)}</span>
                  </div>
                  <div className="flex justify-between p-1.5 bg-white rounded border border-slate-200">
                    <span><MdText text={inhalt.texte.kriechdämpfung108} /></span>
                    <span className="font-bold">{formatDeZahl((1 + 0.8 * exCalc.phi), 3)}</span>
                  </div>
                  <div className="flex justify-between p-2 bg-slate-100 rounded border border-slate-300 font-bold text-xs">
                    <span>NENNER-WERT:</span>
                    <span className="text-slate-900">{formatDeWert(exCalc.nenner)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Rechenergebnis Kopplungsformel */}
            <div className="p-4 bg-shiraz/5 border border-shiraz/20 rounded-xl text-center space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-shiraz block"><MdText text={inhalt.texte.ergebnisDesGekoppeltenGesamtverlusts} /></span>
              <div className="text-2xl font-black font-mono text-shiraz"><MdText text={inhalt.texte.pCSR} />{formatDeWert(exCalc.zaehler)} / {formatDeWert(exCalc.nenner)} = {formatDeWert(exCalc.delta_sig_csr)} N/mm²
              </div>
              <p className="text-[11px] text-text-main/70"><MdText text={inhalt.texte.durchDieKopplungMit} />{formatDeWert(exCalc.nenner)}<MdText text={inhalt.texte.fallenDieTatsächlichenGesamtverluste} /><strong> {formatDeZahl(((1 - 1 / exCalc.nenner) * 100), 0)} % geringer</strong><MdText text={inhalt.texte.ausAlsBeiEiner} /></p>
            </div>
          </div>

          {/* Schritt 4: Gesamtbilanz & Endvorspannkraft */}
          <div className="p-5 bg-white rounded-2xl border border-home-grau/30 shadow-sm space-y-4">
            <h5 className="font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-1.5 border-b border-home-grau/15 pb-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" /><MdText text={inhalt.texte.schritt4EndzustandVerlustbilanz} /></h5>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-500 block"><MdText text={inhalt.texte.nennkraftPPresse} /></span>
                <span className="text-xl font-black text-slate-800 font-mono mt-0.5 block">{formatDeWert(exP0)} kN</span>
                <span className="text-[10px] text-slate-500"><MdText text={inhalt.texte.t100Ausgangswert} /></span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-500 block"><MdText text={inhalt.texte.initialkraftPm0T} /></span>
                <span className="text-xl font-black text-slate-800 font-mono mt-0.5 block">{formatDeWert(exCalc.Pm0)} kN</span>
                <span className="text-[10px] text-slate-500"><MdText text={inhalt.texte.nachReibungSchlupf} /></span>
              </div>

              <div className="p-3 bg-shiraz/10 rounded-xl border border-shiraz/30">
                <span className="text-[10px] uppercase font-bold text-shiraz block"><MdText text={inhalt.texte.endvorspannkraftPm} /></span>
                <span className="text-2xl font-black text-shiraz font-mono mt-0.5 block">{formatDeWert(exCalc.Pminf)} kN</span>
                <span className="text-[10px] text-shiraz/80 font-bold"><MdText text={inhalt.texte.verbleibendBeiT} /></span>
              </div>

              <div className="p-3 bg-rose-50 rounded-xl border border-rose-200">
                <span className="text-[10px] uppercase font-bold text-rose-800 block"><MdText text={inhalt.texte.gesamtverlustPGes} /></span>
                <span className="text-xl font-black text-rose-900 font-mono mt-0.5 block">-{formatDeWert(exCalc.delta_P_total)} kN</span>
                <span className="text-[10px] text-rose-700 font-bold">({formatDeWert(exCalc.loss_pct)} % von P₀)</span>
              </div>
            </div>

            {/* Verlust-Balkendiagramm visuell */}
            <div className="space-y-1.5 text-xs pt-1">
              <span className="font-bold text-slate-700 block"><MdText text={inhalt.texte.aufschlüsselungDerGesamtverluste} />{formatDeWert(exCalc.loss_pct)} %):</span>
              <div className="w-full h-7 bg-slate-100 rounded-xl overflow-hidden flex font-mono text-[10px] font-bold text-white text-center leading-7 shadow-xs">
                <div 
                  className="bg-amber-600 transition-all duration-300" 
                  style={{ width: `${((exCalc.immediateLosses / exCalc.sigma_p0) * 100).toFixed(1)}%` }}
                  title={`Unmittelbar (Reibung/Schlupf/Elast.): -${formatDeZahl(((exCalc.immediateLosses / exCalc.sigma_p0) * 100), 1)} %`}
                ><MdText text={inhalt.texte.unmittelbar} />{formatDeZahl(((exCalc.immediateLosses / exCalc.sigma_p0) * 100), 0)}%)
                </div>
                <div 
                  className="bg-amber-500 transition-all duration-300" 
                  style={{ width: `${((exCalc.term_kriechen / exCalc.nenner / exCalc.sigma_p0) * 100).toFixed(1)}%` }}
                  title={`Kriechen: -${formatDeZahl(((exCalc.term_kriechen / exCalc.nenner / exCalc.sigma_p0) * 100), 1)} %`}
                >
                  Kriechen
                </div>
                <div 
                  className="bg-blue-600 transition-all duration-300" 
                  style={{ width: `${((exCalc.term_schwinden / exCalc.nenner / exCalc.sigma_p0) * 100).toFixed(1)}%` }}
                  title={`Schwinden: -${formatDeZahl(((exCalc.term_schwinden / exCalc.nenner / exCalc.sigma_p0) * 100), 1)} %`}
                >
                  Schwinden
                </div>
                <div 
                  className="bg-purple-600 transition-all duration-300" 
                  style={{ width: `${((exCalc.term_relaxation / exCalc.nenner / exCalc.sigma_p0) * 100).toFixed(1)}%` }}
                  title={`Relaxation: -${formatDeZahl(((exCalc.term_relaxation / exCalc.nenner / exCalc.sigma_p0) * 100), 1)} %`}
                >
                  Rel.
                </div>
                <div 
                  className="bg-emerald-600 transition-all duration-300 flex-1"
                  title={`Verbleibende Vorspannkraft Pm,inf: ${formatDeZahl((100 - exCalc.loss_pct), 1)} %`}
                >
                  Verbleibend: {formatDeZahl((100 - exCalc.loss_pct), 0)} %
                </div>
              </div>
            </div>

            {/* Fazit Box */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-text-main/80 space-y-1 leading-relaxed">
              <strong className="text-slate-900 block"><MdText text={inhalt.texte.ingenieurmäßigesFazitAusDem} /></strong>
              <p><MdText text={inhalt.texte.t1ImBeispielGehen} /><strong>{formatDeWert(exCalc.loss_pct)} %</strong><MdText text={inhalt.texte.derPressenkraftVerlorenSofortverluste} /></p>
              <p><MdText text={inhalt.texte.t2DerKriechanteilIst} /></p>
            </div>
          </div>
        </div>
      </div>
    );
}
