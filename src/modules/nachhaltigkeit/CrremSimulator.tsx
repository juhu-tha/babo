import { TrendingDown, Scale, Sliders, Building, Home, AlertCircle, Layers, Zap } from 'lucide-react';
import { formatDeWert, formatDeZahl } from '@/src/utils/numberFormat';
import type { Dispatch, SetStateAction } from 'react';
import inhalt from '@/content/nachhaltigkeit/CrremSimulator.json';
import { MdText } from '@/src/components/inhalt/MdText';

interface CrremSimulatorProps {
  crremBuildingType: "office" | "residential";
  crremCurrentGwp: number;
  crremResult: { effectiveGwp: number; reductionLabel: string; reductionPct: number; strandingYear: number | null; isCurrentlyStranded: boolean; target2026: number; target2030: number; getTargetForYear: (year: number) => number; };
  crremRetrofit: "none" | "opex" | "capex_huelle" | "capex_deep";
  setCrremBuildingType: Dispatch<SetStateAction<"office" | "residential">>;
  setCrremCurrentGwp: Dispatch<SetStateAction<number>>;
  setCrremRetrofit: Dispatch<SetStateAction<"none" | "opex" | "capex_huelle" | "capex_deep">>;
  setRegulatorikSubTab: Dispatch<SetStateAction<"rechtsrahmen" | "crrem_sim">>;
}

export default function CrremSimulator({ crremBuildingType, crremCurrentGwp, crremResult, crremRetrofit, setCrremBuildingType, setCrremCurrentGwp, setCrremRetrofit, setRegulatorikSubTab }: CrremSimulatorProps) {
  return (
      <div className="flex flex-col gap-6 animate-in fade-in duration-300">

        {/* Header Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-shiraz/10 border border-shiraz/20 rounded-full text-[10px] font-bold uppercase tracking-wider text-shiraz self-start">
            <TrendingDown size={12} className="text-shiraz" /><MdText text={inhalt.texte.crremV2Paris1} /></span>
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
            <Scale className="text-shiraz" size={24} /><MdText text={inhalt.texte.crremDekarbonisierungspfadStrandedAssets} /></h2>
          <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
            <p><MdText text={inhalt.texte.simulierenSieDasStranding} /></p>
          </div>
        </div>

    {/* Interactive CRREM Simulator Grid */}
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

      {/* Inputs (7-cols) */}
      <div className="lg:col-span-7 bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-5">
        <div className="border-b border-home-grau/25 pb-3 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Sliders size={16} className="text-shiraz" /><MdText text={inhalt.texte.gebäudeparameterSanierungsszenarien} /></h3>
            <p className="text-xs text-slate-500 mt-0.5"><MdText text={inhalt.texte.wählenSieGebäudetypAusgangs} /></p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold"><MdText text={inhalt.texte.standortDeutschland} /></span>
        </div>

        {/* Building Type Selector */}
        <div>
          <label className="block text-xs font-bold text-slate-900 mb-2">Immobilien-Assetklasse:</label>
          <div className="grid grid-cols-2 gap-3">
            <button aria-pressed={crremBuildingType === 'office'}
              onClick={() => setCrremBuildingType('office')}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      crremBuildingType === 'office'
                        ? 'border-shiraz bg-shiraz/5 text-shiraz font-bold shadow-xs'
                        : 'border-home-grau/30 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
            >
              <Building size={16} className="mb-1" />
              <strong className="block text-xs"><MdText text={inhalt.texte.büroimmobilieCommercialOffice} /></strong>
              <span className="text-[10px] text-slate-400 font-normal"><MdText text={inhalt.texte.crremBasispfad52Kg} /></span>
            </button>
            <button aria-pressed={crremBuildingType === 'residential'}
              onClick={() => setCrremBuildingType('residential')}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      crremBuildingType === 'residential'
                        ? 'border-shiraz bg-shiraz/5 text-shiraz font-bold shadow-xs'
                        : 'border-home-grau/30 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
            >
              <Home size={16} className="mb-1" />
              <strong className="block text-xs"><MdText text={inhalt.texte.wohngebäudeMultiFamilyResidential} /></strong>
              <span className="text-[10px] text-slate-400 font-normal"><MdText text={inhalt.texte.crremBasispfad35Kg} /></span>
            </button>
          </div>
        </div>

        {/* Slider Current GWP Intensity */}
        <div>
          <div className="flex justify-between text-xs text-slate-900 font-bold mb-1.5">
            <span><MdText text={inhalt.texte.aktuelleCoIntensitätDes} /></span>
            <span className="font-mono text-shiraz text-sm">{formatDeWert(crremCurrentGwp)}<MdText text={inhalt.texte.kgCoEM} /></span>
          </div>
          <input
            type="range"
            min="8"
            max="90"
            step="1"
            value={crremCurrentGwp}
            onChange={(e) => setCrremCurrentGwp(parseFloat(e.target.value))}
            className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-shiraz"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
            <span><MdText text={inhalt.texte.neubauKfw40Ca} /></span>
            <span><MdText text={inhalt.texte.teilsaniertCa3550} /></span>
            <span><MdText text={inhalt.texte.ungedämmterAltbau70Kg} /></span>
          </div>
        </div>

        {/* Retrofit Lever Intervention Selector */}
        <div>
          <label className="block text-xs font-bold text-slate-900 mb-2"><MdText text={inhalt.texte.dekarbonisierungshebelIntervention} /></label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {[
              { id: 'none', label: inhalt.werte.keineMaßnahmeStatusQuo, desc: inhalt.werte.istZustandWirdFortgeschrieben, icon: AlertCircle },
              { id: 'opex', label: inhalt.werte.opexBetriebsoptimierung15, desc: inhalt.werte.smartMeteringThermischerAbgleich, icon: Sliders },
              { id: 'capex_huelle', label: inhalt.werte.capexHülleSanierung35, desc: inhalt.werte.fassadendämmungWdvsHolzfaser3, icon: Layers },
              { id: 'capex_deep', label: inhalt.werte.deepCapexHülleWp, desc: inhalt.werte.kompletteEnergetischeTransformationAusst, icon: Zap }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setCrremRetrofit(item.id as "none" | "opex" | "capex_huelle" | "capex_deep")}
                className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                        crremRetrofit === item.id
                          ? 'border-shiraz bg-shiraz/5 text-shiraz font-bold shadow-xs'
                          : 'border-home-grau/30 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
              >
                <item.icon size={16} className={`shrink-0 mt-0.5 ${crremRetrofit === item.id ? 'text-shiraz' : 'text-slate-400'}`} />
                <div>
                  <strong className="block text-xs leading-tight">{item.label}</strong>
                  <span className="text-[10px] text-slate-500 font-normal leading-normal">{item.desc}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Status & Stranding Calculation Outcome */}
        <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/30 flex flex-col gap-2">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider"><MdText text={inhalt.texte.ergebnisDerCrremKonformitätsprüfung} /></span>
          <div className="flex items-baseline justify-between">
            <span className="text-xs text-slate-700"><MdText text={inhalt.texte.effektiveCoIntensitätNach} /></span>
            <strong className="text-base font-mono text-slate-900 font-extrabold">
              {formatDeZahl(crremResult.effectiveGwp, 1)}<MdText text={inhalt.texte.kgCoEM2} /></strong>
          </div>
          <div className="flex items-baseline justify-between text-xs text-slate-600">
            <span><MdText text={inhalt.texte.zulässigerCrremZielwertIm} /></span>
            <span className="font-mono font-bold text-slate-800">{formatDeZahl(crremResult.target2026, 1)} kg CO₂e</span>
          </div>
          <div className="flex items-baseline justify-between text-xs text-slate-600">
            <span><MdText text={inhalt.texte.zulässigerCrremZielwertIm2} /></span>
            <span className="font-mono font-bold text-slate-800">{formatDeZahl(crremResult.target2030, 1)} kg CO₂e</span>
          </div>
        </div>

      </div>

      {/* Output & Stranded Asset Analysis (5-cols) */}
      <div className="lg:col-span-5 flex flex-col gap-5">

        {/* Stranding Alert Box */}
        <div className={`p-6 rounded-2xl border shadow-sm flex flex-col gap-4 ${
                crremResult.isCurrentlyStranded
                  ? 'bg-rose-50/80 border-rose-200 text-rose-950'
                  : crremResult.strandingYear && crremResult.strandingYear <= 2032
                  ? 'bg-amber-50/80 border-amber-200 text-amber-950'
                  : 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
              }`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-white/70"><MdText text={inhalt.texte.misalignmentStranding} /></span>
            <span className="text-xs font-mono font-bold">Paris 1,5&deg;C</span>
          </div>

          <div className="flex flex-col">
            <span className="text-xs font-medium"><MdText text={inhalt.texte.berechnetesStrandingYearMisalignment} /></span>
            <strong className="text-3xl font-extrabold font-mono mt-1">
              {crremResult.strandingYear ? `Jahr ${crremResult.strandingYear}` : inhalt.werte.nach2050Klimaneutral}
            </strong>
          </div>

          <div className="text-xs leading-relaxed">
            {crremResult.isCurrentlyStranded ? (
              <div className="space-y-2">
                <p className="font-bold text-rose-900"><MdText text={inhalt.texte.akuteGefahrDasGebäude} /></p>
                <p className="text-rose-800/90 text-[11px]"><MdText text={inhalt.texte.dieEmissionenÜberschreitenDen} /></p>
              </div>
            ) : crremResult.strandingYear && crremResult.strandingYear <= 2035 ? (
              <div className="space-y-2">
                <p className="font-bold text-amber-900"><MdText text={inhalt.texte.mittelfristigesStrandingRisikoStranding} />{crremResult.strandingYear})
                </p>
                <p className="text-amber-800/90 text-[11px]"><MdText text={inhalt.texte.dasObjektErfülltDie} /></p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="font-bold text-emerald-900"><MdText text={inhalt.texte.zukunftsfähigParisUndTaxonomie} /></p>
                <p className="text-emerald-800/90 text-[11px]"><MdText text={inhalt.texte.dasGebäudeErfülltDie} /></p>
              </div>
            )}
          </div>

          {/* Progress Visual Bar */}
          <div className="space-y-1.5 pt-2 border-t border-current/15">
            <div className="flex justify-between text-[10px] font-mono">
              <span>2020</span>
              <span><MdText text={inhalt.texte.t2030Zwischenziel} /></span>
              <span><MdText text={inhalt.texte.t2050NetZero} /></span>
            </div>
            <div className="h-2 w-full bg-slate-200/80 rounded-full overflow-hidden flex">
              <div 
                className={`h-full transition-all duration-300 ${
                        crremResult.isCurrentlyStranded ? 'bg-rose-500' : 'bg-emerald-500'
                      }`}
                style={{
                  width: `${Math.min(100, Math.max(5, ((crremResult.strandingYear || 2050) - 2020) / 30 * 100))}%`
                }}
              />
            </div>
          </div>
        </div>

        {/* Economic & Market Impacts Table */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-3">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Scale size={14} className="text-shiraz" /><MdText text={inhalt.texte.immobilienwirtschaftlicheAuswirkungen} /></h4>
          <div className="text-[11px] space-y-2 text-slate-600">
            <div className="p-2 rounded-lg bg-slate-50 border border-slate-150">
              <strong className="text-slate-900 block font-bold"><MdText text={inhalt.texte.brownDiscountVsGreen} /></strong><MdText text={inhalt.texte.investorenFordernBeiIneffizienten} /></div>
            <div className="p-2 rounded-lg bg-slate-50 border border-slate-150">
              <strong className="text-slate-900 block font-bold"><MdText text={inhalt.texte.coBepreisungEtsIi} /></strong><MdText text={inhalt.texte.mitDemEuropäischenBrennstoffemissionshan} /></div>
            <div className="p-2 rounded-lg bg-slate-50 border border-slate-150">
              <strong className="text-slate-900 block font-bold"><MdText text={inhalt.texte.t98Sanierungsdruck} /></strong><MdText text={inhalt.texte.lautBranchenanalysenVerfehlenRund} /></div>
          </div>
        </div>

      </div>

    </div>

        {/* Teaser bridge to the full Rechtsrahmen-Kompendium */}
        <div className="bg-off-white p-5 rounded-2xl border border-home-grau/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Scale size={24} className="text-shiraz shrink-0" />
            <div>
              <h4 className="text-xs md:text-sm font-extrabold text-text-main"><MdText text={inhalt.texte.europäischerNationalerRechtsrahmenFür} /></h4>
              <p className="text-xs text-text-main/80 mt-0.5"><MdText text={inhalt.texte.entdeckenSieAlle23} /></p>
            </div>
          </div>
          <button
            onClick={() => setRegulatorikSubTab('rechtsrahmen')}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-shiraz text-white border border-shiraz hover:bg-shiraz/90 transition-all cursor-pointer shrink-0 flex items-center gap-1.5"
          ><MdText text={inhalt.texte.rechtsrahmenÖffnen} /></button>
        </div>

      </div>
    );
}
