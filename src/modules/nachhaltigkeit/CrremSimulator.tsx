import { TrendingDown, Scale, Sliders, Building, Home, AlertCircle, Layers, Zap } from 'lucide-react';
import { formatDeWert, formatDeZahl } from '@/src/utils/numberFormat';
import type { Dispatch, SetStateAction } from 'react';

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
            <TrendingDown size={12} className="text-shiraz" />
            CRREM v2 &bull; Paris 1,5&deg;C &bull; EU-Taxonomie
          </span>
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
            <Scale className="text-shiraz" size={24} /> CRREM-Dekarbonisierungspfad &amp; Stranded Assets
          </h2>
          <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
            <p>
              Simulieren Sie das Stranding-Risiko von Immobilienbeständen nach der globalen CRREM-Methodik (Carbon Risk Real Estate Monitor). Erkennen Sie das Misalignment Year, bewerten Sie den drohenden &bdquo;Brown Discount&ldquo; und prüfen Sie die neuen regulatorischen Vorgaben der EPBD (EU 2024/1275) und der Ersatzbaustoffverordnung (EBV).
            </p>
          </div>
        </div>

    {/* Interactive CRREM Simulator Grid */}
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

      {/* Inputs (7-cols) */}
      <div className="lg:col-span-7 bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-5">
        <div className="border-b border-home-grau/25 pb-3 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Sliders size={16} className="text-shiraz" />
              Gebäudeparameter &amp; Sanierungsszenarien
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Wählen Sie Gebäudetyp, Ausgangs-Emissionsintensität und Dekarbonisierungshebel.</p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold">
            Standort: Deutschland
          </span>
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
              <strong className="block text-xs">Büroimmobilie (Commercial Office)</strong>
              <span className="text-[10px] text-slate-400 font-normal">CRREM-Basispfad: 52 kg CO₂e (2020) &rarr; 18 kg (2030) &rarr; 0 kg (2050)</span>
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
              <strong className="block text-xs">Wohngebäude (Multi-Family Residential)</strong>
              <span className="text-[10px] text-slate-400 font-normal">CRREM-Basispfad: 35 kg CO₂e (2020) &rarr; 15 kg (2030) &rarr; 0 kg (2050)</span>
            </button>
          </div>
        </div>

        {/* Slider Current GWP Intensity */}
        <div>
          <div className="flex justify-between text-xs text-slate-900 font-bold mb-1.5">
            <span>Aktuelle CO₂-Intensität des Betriebs (Ist-Zustand 2026):</span>
            <span className="font-mono text-shiraz text-sm">{formatDeWert(crremCurrentGwp)} kg CO₂e / (m²_NFA &middot; a)</span>
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
            <span>Neubau / KfW 40 (ca. 10–15 kg)</span>
            <span>Teilsaniert (ca. 35–50 kg)</span>
            <span>Ungedämmter Altbau (&gt; 70 kg)</span>
          </div>
        </div>

        {/* Retrofit Lever Intervention Selector */}
        <div>
          <label className="block text-xs font-bold text-slate-900 mb-2">Dekarbonisierungshebel (Intervention):</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {[
              { id: 'none', label: 'Keine Maßnahme (Status Quo)', desc: 'Ist-Zustand wird fortgeschrieben', icon: AlertCircle },
              { id: 'opex', label: 'Opex: Betriebsoptimierung (-15 %)', desc: 'Smart Metering, thermischer Abgleich, Nachtabsenkung', icon: Sliders },
              { id: 'capex_huelle', label: 'Capex Hülle: Sanierung (-35 %)', desc: 'Fassadendämmung (WDVS/Holzfaser) + 3-fach-Verglasung', icon: Layers },
              { id: 'capex_deep', label: 'Deep Capex: Hülle + WP + PV (-75 %)', desc: 'Komplette energetische Transformation (Ausstieg aus Gas/Öl)', icon: Zap }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setCrremRetrofit(item.id as any)}
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
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Ergebnis der CRREM-Konformitätsprüfung</span>
          <div className="flex items-baseline justify-between">
            <span className="text-xs text-slate-700">Effektive CO₂-Intensität nach Intervention:</span>
            <strong className="text-base font-mono text-slate-900 font-extrabold">
              {formatDeZahl(crremResult.effectiveGwp, 1)} kg CO₂e / (m² &middot; a)
            </strong>
          </div>
          <div className="flex items-baseline justify-between text-xs text-slate-600">
            <span>Zulässiger CRREM-Zielwert im Jahr 2026:</span>
            <span className="font-mono font-bold text-slate-800">{formatDeZahl(crremResult.target2026, 1)} kg CO₂e</span>
          </div>
          <div className="flex items-baseline justify-between text-xs text-slate-600">
            <span>Zulässiger CRREM-Zielwert im Jahr 2030:</span>
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
            <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-white/70">
              Misalignment &amp; Stranding
            </span>
            <span className="text-xs font-mono font-bold">Paris 1,5&deg;C</span>
          </div>

          <div className="flex flex-col">
            <span className="text-xs font-medium">Berechnetes Stranding Year (Misalignment):</span>
            <strong className="text-3xl font-extrabold font-mono mt-1">
              {crremResult.strandingYear ? `Jahr ${crremResult.strandingYear}` : 'Nach 2050 (Klimaneutral)'}
            </strong>
          </div>

          <div className="text-xs leading-relaxed">
            {crremResult.isCurrentlyStranded ? (
              <div className="space-y-2">
                <p className="font-bold text-rose-900">
                  &bull; Akute Gefahr: Das Gebäude ist bereits ein Stranded Asset!
                </p>
                <p className="text-rose-800/90 text-[11px]">
                  Die Emissionen überschreiten den degressiven Pariser 1,5&deg;C-Pfad für 2026. Es droht ein massiver <strong>Brown Discount</strong> (bis zu 20–30 % Marktwertverlust), Verlust der EU-Taxonomie-Konformität und stark verteuerte Bankfinanzierungs-Spreads.
                </p>
              </div>
            ) : crremResult.strandingYear && crremResult.strandingYear <= 2035 ? (
              <div className="space-y-2">
                <p className="font-bold text-amber-900">
                  &bull; Mittelfristiges Stranding-Risiko (Stranding ab {crremResult.strandingYear})
                </p>
                <p className="text-amber-800/90 text-[11px]">
                  Das Objekt erfüllt die aktuellen Vorgaben knapp, wird aber vor 2035 aus dem Zielkorridor fallen. Die Capex-Planung (Sanierungsfahrplan / iSFP) muss spätestens jetzt eingeleitet werden.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="font-bold text-emerald-900">
                  &bull; Zukunftsfähig: Paris- und Taxonomie-konform (Green Premium)
                </p>
                <p className="text-emerald-800/90 text-[11px]">
                  Das Gebäude erfüllt die anspruchsvollen Dekarbonisierungskriterien über einen langen Horizont und sichert institutionellen Investoren ESG-Fähigkeit und stabile Renditen.
                </p>
              </div>
            )}
          </div>

          {/* Progress Visual Bar */}
          <div className="space-y-1.5 pt-2 border-t border-current/15">
            <div className="flex justify-between text-[10px] font-mono">
              <span>2020</span>
              <span>2030 (Zwischenziel)</span>
              <span>2050 (Net-Zero)</span>
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
            <Scale size={14} className="text-shiraz" />
            Immobilienwirtschaftliche Auswirkungen
          </h4>
          <div className="text-[11px] space-y-2 text-slate-600">
            <div className="p-2 rounded-lg bg-slate-50 border border-slate-150">
              <strong className="text-slate-900 block font-bold">Brown Discount vs. Green Premium:</strong>
              Investoren fordern bei ineffizienten Beständen Risikoabschläge von 10–30 %. Energieeffiziente Gebäude erzielen Mietaufschläge und Spitzenbewertungen.
            </div>
            <div className="p-2 rounded-lg bg-slate-50 border border-slate-150">
              <strong className="text-slate-900 block font-bold">CO₂-Bepreisung (ETS II &amp; BEHG):</strong>
              Mit dem europäischen Brennstoffemissionshandel (ETS II; Start nach Beschluss von Ende 2025 auf 2028 verschoben, bis dahin nationaler Emissionshandel nach BEHG) steigen die Betriebskosten fossiler Heizsysteme deutlich.
            </div>
            <div className="p-2 rounded-lg bg-slate-50 border border-slate-150">
              <strong className="text-slate-900 block font-bold">98 % Sanierungsdruck:</strong>
              Laut Branchenanalysen verfehlen rund 98 % des europäischen gewerblichen Bestands ohne Intervention die 2050-Ziele (Gefahr von 303 Mrd. &euro; Abschreibungen).
            </div>
          </div>
        </div>

      </div>

    </div>

        {/* Teaser bridge to the full Rechtsrahmen-Kompendium */}
        <div className="bg-off-white p-5 rounded-2xl border border-home-grau/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Scale size={24} className="text-shiraz shrink-0" />
            <div>
              <h4 className="text-xs md:text-sm font-extrabold text-text-main">
                Europäischer &amp; Nationaler Rechtsrahmen für Gebäude und Baustoffe
              </h4>
              <p className="text-xs text-text-main/80 mt-0.5">
                Entdecken Sie alle 23 relevanten Rechtsvereinbarungen (BauPVO, EPBD, ESPR, ETS II, CBAM, Level(s) u.v.m.) in der interaktiven Kaskade.
              </p>
            </div>
          </div>
          <button
            onClick={() => setRegulatorikSubTab('rechtsrahmen')}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-shiraz text-white border border-shiraz hover:bg-shiraz/90 transition-all cursor-pointer shrink-0 flex items-center gap-1.5"
          >
            Rechtsrahmen öffnen &rarr;
          </button>
        </div>

      </div>
    );
}
