import { Clock, Activity, Timer, Layers, Sliders, Scale } from 'lucide-react';
import { BlockMath, InlineMath } from 'react-katex';
import { Slider } from '@/src/components/ui/Slider';
import KriechModellDiagramm from './KriechModellDiagramm';
import type { Dispatch, SetStateAction } from 'react';
import inhalt from '@/content/mechanischekenngroessen/KriechenSchwinden.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { AuswahlGruppe, alsOption } from '../../components/ui/Auswahlgruppe';

interface KriechenSchwindenProps {
  rheoModus: "relaxieren" | "kriechen";
  rheoTauSec: number;
  rheoWert0: number;
  setRheoModus: Dispatch<SetStateAction<"relaxieren" | "kriechen">>;
  setRheoTauSec: Dispatch<SetStateAction<number>>;
  setRheoWert0: Dispatch<SetStateAction<number>>;
}

export default function KriechenSchwinden({ rheoModus, rheoTauSec, rheoWert0, setRheoModus, setRheoTauSec, setRheoWert0 }: KriechenSchwindenProps) {
  return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Box 1: Kriechen */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-home-grau/20 mb-3">
                <h3 className="font-bold text-sm text-text-main flex items-center gap-1.5">
                  <Clock className="text-shiraz" size={17} /><MdText text={inhalt.texte.t1KriechenCreep} /></h3>
                <span className="text-[10px] font-mono bg-blue-50 text-blue-800 px-2 py-0.5 rounded border border-blue-200">
                  σ = konst.
                </span>
              </div>

              <p className="text-xs text-text-main/80 leading-relaxed mb-3"><MdText text={inhalt.texte.kriechenIstDieZeitabhängige} /></p>

              <div className="bg-off-white p-3 rounded-xl border border-home-grau/25 mb-3 text-xs space-y-1">
                <div className="font-bold text-text-main"><MdText text={inhalt.texte.gesamtdehnungNachZeitT} /></div>
                <BlockMath math="\varepsilon(t) = \varepsilon_{\text{el}} \cdot \left[ 1 + \varphi(t, t_0) \right]" />
                <div className="font-bold text-text-main pt-1"><MdText text={inhalt.texte.effektiverLangzeitEModul} /></div>
                <BlockMath math="E_{c,\text{eff}} = \frac{E_{cm}}{1 + \varphi(t, t_0)}" />
              </div>

              <div className="text-[11px] text-text-main/75 space-y-1">
                <div><MdText text={inhalt.texte.ursacheFolgen} /></div>
                <p><MdText text={inhalt.texte.imZementsteinFührtDie} /></p>
              </div>
            </div>

            <div className="mt-4 pt-2.5 border-t border-home-grau/20 text-[10px] text-slate-500 font-mono"><MdText text={inhalt.texte.typischeKriechzahlBeton1} /></div>
          </div>

          {/* Box 2: Schwinden */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-home-grau/20 mb-3">
                <h3 className="font-bold text-sm text-text-main flex items-center gap-1.5">
                  <Activity className="text-amber-600" size={17} /><MdText text={inhalt.texte.t2SchwindenShrinkage} /></h3>
                <span className="text-[10px] font-mono bg-amber-50 text-amber-800 px-2 py-0.5 rounded border border-amber-200"><MdText text={inhalt.texte.t0Lastfrei} /></span>
              </div>

              <p className="text-xs text-text-main/80 leading-relaxed mb-3"><MdText text={inhalt.texte.schwindenIstDieLastunabhängige} /></p>

              <div className="bg-off-white p-3 rounded-xl border border-home-grau/25 mb-3 text-xs space-y-1">
                <div className="font-bold text-text-main">Gesamtschwinddehnung:</div>
                <BlockMath math="\varepsilon_{\text{cs}} = \varepsilon_{\text{cd}} + \varepsilon_{\text{ca}}" />
                <div className="text-[10px] text-slate-600 font-mono"><MdText text={inhalt.texte.cdTrocknungsschwindenDiffusionsvorgangBr} /></div>
              </div>

              <div className="text-[11px] text-text-main/75 space-y-1">
                <div><MdText text={inhalt.texte.zwangRissbildung} /></div>
                <p><MdText text={inhalt.texte.wirdDasFreieSchwinden} /></p>
              </div>
            </div>

            <div className="mt-4 pt-2.5 border-t border-home-grau/20 text-[10px] text-slate-500 font-mono"><MdText text={inhalt.texte.endschwindmaßBetonCs0} /></div>
          </div>

          {/* Box 3: Relaxation */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-home-grau/20 mb-3">
                <h3 className="font-bold text-sm text-text-main flex items-center gap-1.5">
                  <Timer className="text-purple-600" size={17} /><MdText text={inhalt.texte.t3RelaxationStressRelaxation} /></h3>
                <span className="text-[10px] font-mono bg-purple-50 text-purple-800 px-2 py-0.5 rounded border border-purple-200">
                  ε = konst.
                </span>
              </div>

              <p className="text-xs text-text-main/80 leading-relaxed mb-3"><MdText text={inhalt.texte.relaxationIstDerZeitabhängige} /></p>

              <div className="bg-off-white p-3 rounded-xl border border-home-grau/25 mb-3 text-xs space-y-1">
                <div className="font-bold text-text-main"><MdText text={inhalt.texte.spannungsverlaufMaxwellElement} /></div>
                <BlockMath math="\sigma(t) = \sigma_0 \cdot \exp\left(-\frac{t}{\tau_{\text{rel}}}\right)" />
                <div className="text-[10px] text-slate-600 font-mono"><MdText text={inhalt.texte.relaxationszeitEVerhältnisViskosität} /></div>
              </div>

              <div className="text-[11px] text-text-main/75 space-y-1">
                <div><strong>Praxisbeispiele:</strong></div>
                <ul className="list-disc list-inside space-y-0.5 pl-0.5">
                  <li><MdText text={inhalt.texte.spannbetonVorspanndrähteVerlierenDurch} /></li>
                  <li><MdText text={inhalt.texte.fugendichtstoffePolymerabdichtungenEntsp} /></li>
                  <li><MdText text={inhalt.texte.vorgespannteSchraubenSetzenUnd} /></li>
                </ul>
              </div>
            </div>

            <div className="mt-4 pt-2.5 border-t border-home-grau/20 text-[10px] text-slate-500 font-mono"><MdText text={inhalt.texte.spannstahlKlassenNachEc2} /></div>
          </div>

        </div>

        {/* Rheologische Ersatzmodelle */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
          <h3 className="text-base font-bold text-text-main flex items-center gap-2 mb-3 pb-2 border-b border-home-grau/20">
            <Layers className="text-shiraz" size={18} /><MdText text={inhalt.texte.rheologischeErsatzmodelleFederDämpfer} /></h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div className="p-3.5 bg-off-white rounded-xl border border-home-grau/25 space-y-2">
              <div className="font-bold text-text-main"><MdText text={inhalt.texte.t1HookeKörperFeder} /></div>
              <div className="text-[11px] font-mono text-shiraz">σ = E · ε</div>
              <p className="text-[11px] text-text-main/75"><MdText text={inhalt.texte.reinElastischVerzögerungsfreiVollkommen} /></p>
            </div>

            <div className="p-3.5 bg-off-white rounded-xl border border-home-grau/25 space-y-2">
              <div className="font-bold text-text-main"><MdText text={inhalt.texte.t2NewtonKörperDämpfer} /></div>
              <div className="text-[11px] font-mono text-shiraz"><MdText text={inhalt.texte.dDt} /></div>
              <p className="text-[11px] text-text-main/75"><MdText text={inhalt.texte.reinViskoseFlüssigkeitDie} /></p>
            </div>

            <div className="p-3.5 bg-off-white rounded-xl border border-home-grau/25 space-y-2">
              <div className="font-bold text-text-main"><MdText text={inhalt.texte.t3MaxwellModellReihe} /></div>
              <div className="text-[11px] font-mono text-shiraz"><MdText text={inhalt.texte.federDämpferInReihe} /></div>
              <p className="text-[11px] text-text-main/75"><MdText text={inhalt.texte.grundmodellFürSpannungsrelaxationBei} /></p>
            </div>

            <div className="p-3.5 bg-off-white rounded-xl border border-home-grau/25 space-y-2">
              <div className="font-bold text-text-main"><MdText text={inhalt.texte.t4KelvinVoigtParallel} /></div>
              <div className="text-[11px] font-mono text-shiraz"><MdText text={inhalt.texte.federDämpferParallel} /></div>
              <p className="text-[11px] text-text-main/75"><MdText text={inhalt.texte.grundmodellFürVerzögerteElastizität} /></p>
            </div>
          </div>

          {/* INTERAKTIVER RHEOLOGIE-SIMULATOR: KRIECHEN VS. RELAXIEREN */}
          <div className="mt-6 pt-5 border-t border-home-grau/20 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Sliders className="text-shiraz" size={17} />
                <h4 className="text-sm font-bold text-text-main uppercase tracking-wider"><MdText text={inhalt.texte.liveSimulatorRheologischerModelle} /></h4>
              </div>

              {/* Umschalter: Relaxieren vs. Kriechen */}
              <AuswahlGruppe label="Versuchsart" className="flex bg-off-white p-1 rounded-xl border border-home-grau/30 gap-1 text-xs">
                <button {...alsOption(rheoModus === 'relaxieren')}
                  onClick={() => setRheoModus('relaxieren')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      rheoModus === 'relaxieren'
                        ? 'bg-purple-700 text-white shadow-sm'
                        : 'text-text-main/70 hover:text-text-main hover:bg-white'
                    }`}
                >
                  <Timer size={14} /><MdText text={inhalt.texte.t1RelaxierenKonst} /></button>
                <button {...alsOption(rheoModus === 'kriechen')}
                  onClick={() => setRheoModus('kriechen')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      rheoModus === 'kriechen'
                        ? 'bg-shiraz text-white shadow-sm'
                        : 'text-text-main/70 hover:text-text-main hover:bg-white'
                    }`}
                >
                  <Clock size={14} /><MdText text={inhalt.texte.t2KriechenKonst} /></button>
              </AuswahlGruppe>
            </div>

            {/* Slider & Berechnungen */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-off-white p-4 rounded-xl border border-home-grau/25">
              <Slider
                label={rheoModus === 'relaxieren' ? inhalt.werte.anfangsspannung : inhalt.werte.dauerlastspannung}
                min={2}
                max={50}
                step={1}
                value={rheoWert0}
                unit="MPa"
                info={rheoModus === 'relaxieren' ? inhalt.werte.ausgangsspannungBeimDehnungssprungE : inhalt.werte.konstantWirkendeDauerlastspannung}
                onChange={(e) => setRheoWert0(Number(e.target.value))}
              />
              <Slider
                label={rheoModus === 'relaxieren' ? inhalt.werte.relaxationszeitE : inhalt.werte.retardationszeitE}
                min={0.5}
                max={8.0}
                step={0.5}
                value={rheoTauSec}
                unit="s"
                info={inhalt.werte.verhältnisVonViskositätZu}
                onChange={(e) => setRheoTauSec(Number(e.target.value))}
              />
            </div>

            {/* Live SVG Diagramm der Ersatzmodelle */}
            {<KriechModellDiagramm rheoModus={rheoModus} rheoTauSec={rheoTauSec} rheoWert0={rheoWert0} />}
          </div>
        </div>

        {/* KRIECHEN BEI UNTERSCHIEDLICHEN BAUSTOFFEN */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-6">
          <div className="border-b border-home-grau/20 pb-3">
            <h3 className="text-base font-bold text-text-main flex items-center gap-2">
              <Scale className="text-shiraz" size={18} /><MdText text={inhalt.texte.kriechenBeiUnterschiedlichenWerkstoffen} /></h3>
            <p className="text-xs text-text-main/70 mt-1"><MdText text={inhalt.texte.kriechenTrittKeineswegsNur} /></p>
          </div>

          {/* 6 Werkstoff-Karten für Kriechen */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">

            {/* 1. Beton & Zementstein */}
            <div className="p-4 bg-off-white rounded-xl border border-home-grau/25 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-shiraz text-sm"><MdText text={inhalt.texte.betonZementstein} /></span>
                  <span className="font-mono text-[10px] bg-red-100 text-red-800 px-2 py-0.5 rounded font-bold"><MdText text={inhalt.texte.ec2DinEn1992} /></span>
                </div>
                <div className="text-[11px] font-semibold text-text-main mb-1.5">
                  Kriechzahl <InlineMath math="\varphi(t, t_0) \approx 1{,}5 \text{ bis } 3{,}5" />
                </div>
                <p className="text-[11px] text-text-main/80 leading-relaxed mb-2"><MdText text={inhalt.texte.mechanismusGleitenDerSchichtstrukturen} /></p>
                <div className="p-2 bg-white rounded-lg border border-home-grau/20 text-[10px] text-text-main/75 space-y-1">
                  <div><MdText text={inhalt.texte.grundkriechenBasicCreepUnter} /></div>
                  <div><MdText text={inhalt.texte.trocknungskriechenPickettEffektBeschleun} /></div>
                  <div><MdText text={inhalt.texte.berechnungsansatzECText} /></div>
                </div>
              </div>
            </div>

            {/* 2. Holz & Holzwerkstoffe */}
            <div className="p-4 bg-off-white rounded-xl border border-home-grau/25 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-amber-800 text-sm"><MdText text={inhalt.texte.holzHolzwerkstoffe} /></span>
                  <span className="font-mono text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold"><MdText text={inhalt.texte.ec5DinEn1995} /></span>
                </div>
                <div className="text-[11px] font-semibold text-text-main mb-1.5">
                  Verformungsbeiwert <InlineMath math="k_{\text{def}} = 0{,}60 \text{ bis } 2{,}00" />
                </div>
                <p className="text-[11px] text-text-main/80 leading-relaxed mb-2"><MdText text={inhalt.texte.mechanismusFließenDerAmorphen} /></p>
                <div className="p-2 bg-white rounded-lg border border-home-grau/20 text-[10px] text-text-main/75 space-y-1">
                  <div><MdText text={inhalt.texte.nutzungsklassenNkl1Innenraum} /></div>
                  <div><MdText text={inhalt.texte.mechanosorptivesKriechenWechselndeFeucht} /></div>
                  <div><MdText text={inhalt.texte.endverformungUTextFin} /></div>
                </div>
              </div>
            </div>

            {/* 3. Mauerwerk */}
            <div className="p-4 bg-off-white rounded-xl border border-home-grau/25 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-orange-700 text-sm"><MdText text={inhalt.texte.mauerwerkMörtel} /></span>
                  <span className="font-mono text-[10px] bg-orange-100 text-orange-800 px-2 py-0.5 rounded font-bold"><MdText text={inhalt.texte.ec6DinEn1996} /></span>
                </div>
                <div className="text-[11px] font-semibold text-text-main mb-1.5">
                  Endkriechzahl <InlineMath math="\Phi_{\infty} \approx 0{,}5 \text{ bis } 3{,}0" />
                </div>
                <p className="text-[11px] text-text-main/80 leading-relaxed mb-2"><MdText text={inhalt.texte.mechanismusKriechverformungenFindenFast} /></p>
                <div className="p-2 bg-white rounded-lg border border-home-grau/20 text-[10px] text-text-main/75 space-y-1">
                  <div><MdText text={inhalt.texte.mauerziegelMziPhiInfty} /></div>
                  <div><MdText text={inhalt.texte.kalksandsteinKsPhiInfty} /></div>
                  <div><MdText text={inhalt.texte.porenbetonPbLeichtbetonPhi} /></div>
                </div>
              </div>
            </div>

            {/* 4. Baustahl & Metalle */}
            <div className="p-4 bg-off-white rounded-xl border border-home-grau/25 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-800 text-sm"><MdText text={inhalt.texte.baustahlMetalle} /></span>
                  <span className="font-mono text-[10px] bg-slate-200 text-slate-800 px-2 py-0.5 rounded font-bold"><MdText text={inhalt.texte.ec3DinEn1993} /></span>
                </div>
                <div className="text-[11px] font-semibold text-text-main mb-1.5"><MdText text={inhalt.texte.raumtemperaturVarphiApprox0} /></div>
                <p className="text-[11px] text-text-main/80 leading-relaxed mb-2"><MdText text={inhalt.texte.mechanismusBeiT0} /></p>
                <div className="p-2 bg-white rounded-lg border border-home-grau/20 text-[10px] text-text-main/75 space-y-1">
                  <div><MdText text={inhalt.texte.phasen1Primäres2} /></div>
                  <div><MdText text={inhalt.texte.spannstahlRelaxationHochfesteDrähte} /></div>
                </div>
              </div>
            </div>

            {/* 5. Kunststoffe & Elastomere */}
            <div className="p-4 bg-off-white rounded-xl border border-home-grau/25 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-purple-700 text-sm"><MdText text={inhalt.texte.kunststoffePolymere} /></span>
                  <span className="font-mono text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-bold"><MdText text={inhalt.texte.dinEnIso899} /></span>
                </div>
                <div className="text-[11px] font-semibold text-text-main mb-1.5">
                  Kriechmodul <InlineMath math="E_c(t) = \frac{\sigma_0}{\varepsilon(t)} \ll E_0" />
                </div>
                <p className="text-[11px] text-text-main/80 leading-relaxed mb-2"><MdText text={inhalt.texte.mechanismusPolymerkettenEntknäuelnUnd} /></p>
                <div className="p-2 bg-white rounded-lg border border-home-grau/20 text-[10px] text-text-main/75 space-y-1">
                  <div><MdText text={inhalt.texte.praxisRohreDichtungsbahnenElastomer} /></div>
                  <div><MdText text={inhalt.texte.auslegungNachweisMussStets} /></div>
                </div>
              </div>
            </div>

            {/* 6. Boden & Glas / CFK */}
            <div className="p-4 bg-off-white rounded-xl border border-home-grau/25 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-teal-800 text-sm"><MdText text={inhalt.texte.bödenGlasCfk} /></span>
                  <span className="font-mono text-[10px] bg-teal-100 text-teal-800 px-2 py-0.5 rounded font-bold"><MdText text={inhalt.texte.ec7Din1054Din} /></span>
                </div>
                <div className="text-[11px] font-semibold text-text-main mb-1.5"><MdText text={inhalt.texte.bodenSekundäreSetzungGlas} /></div>
                <p className="text-[11px] text-text-main/80 leading-relaxed mb-2"><MdText text={inhalt.texte.bodenNachAbschlussDer} /></p>
                <div className="p-2 bg-white rounded-lg border border-home-grau/20 text-[10px] text-text-main/75 space-y-1">
                  <div><MdText text={inhalt.texte.bauglasAbsolutKriechfreiBis} /></div>
                  <div><MdText text={inhalt.texte.cfkKohlenstofffasernSindKriechfrei} /></div>
                </div>
              </div>
            </div>

          </div>

          {/* Übersichtstabelle Werkstoff-Kriechen */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-off-white text-text-main font-bold border-b border-home-grau/30">
                <tr>
                  <th className="p-2.5">Werkstoff</th>
                  <th className="p-2.5"><MdText text={inhalt.texte.kriechneigungBei20C} /></th>
                  <th className="p-2.5"><MdText text={inhalt.texte.normativerKennwert} /></th>
                  <th className="p-2.5"><MdText text={inhalt.texte.mikrophysikalischeUrsache} /></th>
                  <th className="p-2.5"><MdText text={inhalt.texte.praxisRelevanzImBauwesen} /></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-home-grau/20 text-[11px]">
                <tr>
                  <td className="p-2.5 font-bold text-shiraz"><MdText text={inhalt.texte.betonC3037} /></td>
                  <td className="p-2.5 text-red-700 font-semibold">Sehr hoch</td>
                  <td className="p-2.5 font-mono"><MdText text={inhalt.texte.t0153} /></td>
                  <td className="p-2.5"><MdText text={inhalt.texte.wasserumlagerungInCS} /></td>
                  <td className="p-2.5"><MdText text={inhalt.texte.verdreifachungDerDeckendurchbiegungStütz} /></td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-amber-800">Holz (C24)</td>
                  <td className="p-2.5 text-amber-700 font-semibold"><MdText text={inhalt.texte.hochStarkFeuchteabhängig} /></td>
                  <td className="p-2.5 font-mono"><MdText text={inhalt.texte.kDef06} /></td>
                  <td className="p-2.5"><MdText text={inhalt.texte.viskoelastischesFließenVonLignin} /></td>
                  <td className="p-2.5"><MdText text={inhalt.texte.großeDachDeckendurchbiegungenNkl} /></td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-orange-700">Mauerwerk</td>
                  <td className="p-2.5 text-orange-700 font-semibold"><MdText text={inhalt.texte.mittelBisHoch} /></td>
                  <td className="p-2.5 font-mono"><MdText text={inhalt.texte.t05Bis3} /></td>
                  <td className="p-2.5"><MdText text={inhalt.texte.mörtelfugenkriechenGesteinsleimstauchung} /></td>
                  <td className="p-2.5"><MdText text={inhalt.texte.setzungenInTragendenWandpfeilern} /></td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-slate-800"><MdText text={inhalt.texte.baustahlS235S355} /></td>
                  <td className="p-2.5 text-slate-500 font-semibold"><MdText text={inhalt.texte.keineBeiT350} /></td>
                  <td className="p-2.5 font-mono">φ = 0 (EC3)</td>
                  <td className="p-2.5"><MdText text={inhalt.texte.atomgitterStabilVersetzungskletternErst} /></td>
                  <td className="p-2.5"><MdText text={inhalt.texte.kriechsicherBeiRaumklimaVersagen} /></td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-purple-700"><MdText text={inhalt.texte.kunststoffePePvc} /></td>
                  <td className="p-2.5 text-red-700 font-semibold">Extrem hoch</td>
                  <td className="p-2.5 font-mono"><MdText text={inhalt.texte.ecT0T} /></td>
                  <td className="p-2.5"><MdText text={inhalt.texte.entknäuelungViskosesGleitenDer} /></td>
                  <td className="p-2.5"><MdText text={inhalt.texte.ovalisierungVonKunststoffrohrenNachlasse} /></td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-teal-800"><MdText text={inhalt.texte.tonSchluffboden} /></td>
                  <td className="p-2.5 text-amber-700 font-semibold"><MdText text={inhalt.texte.hochÜberJahrzehnte} /></td>
                  <td className="p-2.5 font-mono"><MdText text={inhalt.texte.cELogT} /></td>
                  <td className="p-2.5"><MdText text={inhalt.texte.viskoseUmlagerungVonTonmineralplättchen} /></td>
                  <td className="p-2.5"><MdText text={inhalt.texte.langzeitsenkungVonGroßbauwerkenZ} /></td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-slate-700">Bauglas</td>
                  <td className="p-2.5 text-emerald-700 font-semibold"><MdText text={inhalt.texte.keine0} /></td>
                  <td className="p-2.5 font-mono"><MdText text={inhalt.texte.t0Din18008} /></td>
                  <td className="p-2.5"><MdText text={inhalt.texte.amorphesSilicatnetzwerkStarrUnterhalb} /></td>
                  <td className="p-2.5"><MdText text={inhalt.texte.keineVerformungszunahmeStatischeErmüdung} /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* UMFASSENDE SYSTEMATIK ALLER SCHWINDARTEN */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-6">
          <div className="border-b border-home-grau/20 pb-3">
            <h3 className="text-base font-bold text-text-main flex items-center gap-2">
              <Activity className="text-shiraz" size={18} /><MdText text={inhalt.texte.systematikAllerSchwindartenIm} /></h3>
            <p className="text-xs text-text-main/70 mt-1"><MdText text={inhalt.texte.schwindenIstDieLastunabhängige2} /></p>
          </div>

          {/* Die 6 Schwindarten im Detail */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">

            {/* 1. Frühschwinden */}
            <div className="p-4 bg-off-white rounded-xl border border-home-grau/25 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-shiraz text-sm"><MdText text={inhalt.texte.t1FrühschwindenPlastischesSchwinden} /></span>
                  <span className="font-mono text-[10px] bg-red-100 text-red-800 px-2 py-0.5 rounded font-bold">0 – 24 h</span>
                </div>
                <div className="text-[11px] font-semibold text-text-main mb-1.5"><MdText text={inhalt.texte.kapillarschwindenSchrumpfen} /></div>
                <p className="text-[11px] text-text-main/80 leading-relaxed mb-2.5"><MdText text={inhalt.texte.verdunstetWasserVonDer} /></p>
                <div className="p-2 bg-white rounded-lg border border-home-grau/20 text-[10px] text-text-main/75 space-y-1">
                  <div><MdText text={inhalt.texte.schadensbildKlaffendeUnregelmäßigeRisse} /></div>
                  <div><MdText text={inhalt.texte.gegenmaßnahmenUnverzüglichesAbdeckenMit} /></div>
                </div>
              </div>
            </div>

            {/* 2. Autogenes Schwinden */}
            <div className="p-4 bg-off-white rounded-xl border border-home-grau/25 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-amber-700 text-sm"><MdText text={inhalt.texte.t2AutogenesSchwinden} /></span>
                  <span className="font-mono text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold">1 d – 28 d</span>
                </div>
                <div className="text-[11px] font-semibold text-text-main mb-1.5">Selbsttrocknungsschwinden</div>
                <p className="text-[11px] text-text-main/80 leading-relaxed mb-2.5"><MdText text={inhalt.texte.findetOhneJedenFeuchtigkeitsaustausch} /></p>
                <div className="p-2 bg-white rounded-lg border border-home-grau/20 text-[10px] text-text-main/75 space-y-1">
                  <div><MdText text={inhalt.texte.relevanzExtremDominantBei} /></div>
                  <div><MdText text={inhalt.texte.gegenmaßnahmenInnereNachbehandlungSap} /></div>
                </div>
              </div>
            </div>

            {/* 3. Trocknungsschwinden */}
            <div className="p-4 bg-off-white rounded-xl border border-home-grau/25 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-blue-700 text-sm"><MdText text={inhalt.texte.t3Trocknungsschwinden} /></span>
                  <span className="font-mono text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold"><MdText text={inhalt.texte.monateJahre} /></span>
                </div>
                <div className="text-[11px] font-semibold text-text-main mb-1.5"><MdText text={inhalt.texte.klassischesDiffusionsschwinden} /></div>
                <p className="text-[11px] text-text-main/80 leading-relaxed mb-2.5"><MdText text={inhalt.texte.diffusionsbedingteAbgabeVonPhysikalisch} /></p>
                <div className="p-2 bg-white rounded-lg border border-home-grau/20 text-[10px] text-text-main/75 space-y-1">
                  <div><MdText text={inhalt.texte.größenordnungTypischVarepsilonText} /></div>
                  <div><MdText text={inhalt.texte.einflussfaktorenRelativeLuftfeuchteRh} /></div>
                </div>
              </div>
            </div>

            {/* 4. Karbonatisierungsschwinden */}
            <div className="p-4 bg-off-white rounded-xl border border-home-grau/25 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-purple-700 text-sm"><MdText text={inhalt.texte.t4Karbonatisierungsschwinden} /></span>
                  <span className="font-mono text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-bold"><MdText text={inhalt.texte.jahreJahrzehnte} /></span>
                </div>
                <div className="text-[11px] font-semibold text-text-main mb-1.5"><MdText text={inhalt.texte.chemischeReaktionMitAtmosphärischem} /></div>
                <p className="text-[11px] text-text-main/80 leading-relaxed mb-2.5"><MdText text={inhalt.texte.reaktionVonGasförmigemText} /></p>
                <div className="p-2 bg-white rounded-lg border border-home-grau/20 text-[10px] text-text-main/75 space-y-1">
                  <div><MdText text={inhalt.texte.besonderheitMaximalerEffektBei} /></div>
                </div>
              </div>
            </div>

            {/* 5. Thermisches Schwinden */}
            <div className="p-4 bg-off-white rounded-xl border border-home-grau/25 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-emerald-700 text-sm"><MdText text={inhalt.texte.t5ThermischesSchwinden} /></span>
                  <span className="font-mono text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">1 d – 7 d</span>
                </div>
                <div className="text-[11px] font-semibold text-text-main mb-1.5"><MdText text={inhalt.texte.abkühlungskontraktionNachWärmespitze} /></div>
                <p className="text-[11px] text-text-main/80 leading-relaxed mb-2.5"><MdText text={inhalt.texte.dieExothermeZementhydratationSetzt} /></p>
                <div className="p-2 bg-white rounded-lg border border-home-grau/20 text-[10px] text-text-main/75 space-y-1">
                  <div><MdText text={inhalt.texte.rissursacheBeiDeltaT} /></div>
                  <div><MdText text={inhalt.texte.gegenmaßnahmenLhZementeCem} /></div>
                </div>
              </div>
            </div>

            {/* 6. Chemische Kontraktion */}
            <div className="p-4 bg-off-white rounded-xl border border-home-grau/25 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-800 text-sm"><MdText text={inhalt.texte.t6ChemischeKontraktion} /></span>
                  <span className="font-mono text-[10px] bg-slate-200 text-slate-800 px-2 py-0.5 rounded font-bold"><MdText text={inhalt.texte.molekulareEbene} /></span>
                </div>
                <div className="text-[11px] font-semibold text-text-main mb-1.5">Le-Chatelier-Kontraktion</div>
                <p className="text-[11px] text-text-main/80 leading-relaxed mb-2.5"><MdText text={inhalt.texte.dasSpezifischeVolumenDer} /></p>
                <div className="p-2 bg-white rounded-lg border border-home-grau/20 text-[10px] text-text-main/75 space-y-1">
                  <div><MdText text={inhalt.texte.auswirkungVorDemErstarren} /></div>
                </div>
              </div>
            </div>

          </div>

          {/* Übersichtstabelle */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-off-white text-text-main font-bold border-b border-home-grau/30">
                <tr>
                  <th className="p-2.5">Schwindart</th>
                  <th className="p-2.5">Zeitpunkt</th>
                  <th className="p-2.5">Feuchtefluss</th>
                  <th className="p-2.5"><MdText text={inhalt.texte.physikalischChemischerMechanismus} /></th>
                  <th className="p-2.5"><MdText text={inhalt.texte.gegenmaßnahmenAufDerBaustelle} /></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-home-grau/20 text-[11px]">
                <tr>
                  <td className="p-2.5 font-bold text-shiraz"><MdText text={inhalt.texte.frühschwindenPlastisch} /></td>
                  <td className="p-2.5 font-mono"><MdText text={inhalt.texte.t024Stunden} /></td>
                  <td className="p-2.5"><MdText text={inhalt.texte.wasserverlustNachAußen} /></td>
                  <td className="p-2.5"><MdText text={inhalt.texte.meniskenbildungInKapillarenKapillardruck} /></td>
                  <td className="p-2.5"><MdText text={inhalt.texte.sofortigesAbdeckenMitFolien} /></td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-amber-700"><MdText text={inhalt.texte.autogenesSchwinden} /></td>
                  <td className="p-2.5 font-mono">1–28 Tage</td>
                  <td className="p-2.5"><MdText text={inhalt.texte.keinFeuchteflussNachAußen} /></td>
                  <td className="p-2.5"><MdText text={inhalt.texte.selbsttrocknungDurchChemischenWasserverb} /></td>
                  <td className="p-2.5"><MdText text={inhalt.texte.internalCuringSapGesättigter} /></td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-blue-700">Trocknungsschwinden</td>
                  <td className="p-2.5 font-mono"><MdText text={inhalt.texte.monateBisJahre} /></td>
                  <td className="p-2.5"><MdText text={inhalt.texte.wasserabgabeAnUmwelt} /></td>
                  <td className="p-2.5"><MdText text={inhalt.texte.gelporenwasserDiffusionBisZur} /></td>
                  <td className="p-2.5"><MdText text={inhalt.texte.niedrigerZementleimgehaltSteifeGesteinsk} /></td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-purple-700">Karbonatisierungsschwinden</td>
                  <td className="p-2.5 font-mono">Jahre</td>
                  <td className="p-2.5"><MdText text={inhalt.texte.coAufnahmeAusLuft} /></td>
                  <td className="p-2.5"><MdText text={inhalt.texte.auflösungVonCaOh} /></td>
                  <td className="p-2.5"><MdText text={inhalt.texte.dichtesBetongefügeAusreichendeBetondecku} /></td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-emerald-700"><MdText text={inhalt.texte.thermischesSchwinden} /></td>
                  <td className="p-2.5 font-mono">1–7 Tage</td>
                  <td className="p-2.5"><MdText text={inhalt.texte.wärmeabgabeNachAußen} /></td>
                  <td className="p-2.5"><MdText text={inhalt.texte.längenkontraktionBeimAbkühlenDes} /></td>
                  <td className="p-2.5"><MdText text={inhalt.texte.lhZementeCemIii} /></td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-slate-800"><MdText text={inhalt.texte.chemischeKontraktion} /></td>
                  <td className="p-2.5 font-mono"><MdText text={inhalt.texte.stundenBisTage} /></td>
                  <td className="p-2.5"><MdText text={inhalt.texte.innererProzess} /></td>
                  <td className="p-2.5"><MdText text={inhalt.texte.leChatelierMolvolumenHydratphasen} /></td>
                  <td className="p-2.5"><MdText text={inhalt.texte.thermodynamischNichtVerhinderbarSteuert} /></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Schwinden anderer Baustoffe: Holz, Ton, Metalle */}
          <div className="pt-2 border-t border-home-grau/20">
            <h4 className="text-xs font-bold text-text-main mb-2"><MdText text={inhalt.texte.schwindverhaltenBeiAnderenWerkstoffen} /></h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px] text-text-main/80">
              <div className="p-3 bg-off-white rounded-lg border border-home-grau/20 space-y-1">
                <div className="font-bold text-text-main"><MdText text={inhalt.texte.holzHygroskopischesSchwinden} /></div>
                <p className="text-[10px] leading-relaxed"><MdText text={inhalt.texte.trittAusschließlichUnterhalbDes} /></p>
                <div className="font-mono text-[10px] text-slate-700"><MdText text={inhalt.texte.längsZurFaserL} /></div>
              </div>

              <div className="p-3 bg-off-white rounded-lg border border-home-grau/20 space-y-1">
                <div className="font-bold text-text-main"><MdText text={inhalt.texte.mauerziegelLehm} /></div>
                <p className="text-[10px] leading-relaxed"><MdText text={inhalt.texte.tonschwindenWasserfilmeZwischenDen} /></p>
              </div>

              <div className="p-3 bg-off-white rounded-lg border border-home-grau/20 space-y-1">
                <div className="font-bold text-text-main"><MdText text={inhalt.texte.metallePolymere} /></div>
                <p className="text-[10px] leading-relaxed"><MdText text={inhalt.texte.erstarrungsschrumpfPhasenübergangFlüssig} /></p>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
}
