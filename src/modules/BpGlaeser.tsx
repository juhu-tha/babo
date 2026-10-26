import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';
import { PSI_ABSTANDHALTER, uwFenster } from '@/src/calc/fenster';
import { EingabeHinweise } from '@/src/components/ui/EingabeHinweise';
import React, { useState, useMemo } from 'react';
import { 
  Layers, 
  Maximize2, 
  ShieldCheck, 
  Sparkles, 
  Zap, 
  Thermometer, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  Calculator, 
  Compass, 
  Building2, 
  Sliders, 
  ChevronRight, 
  FileText 
} from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { InlineMath } from 'react-katex';
import { GLASS_PRODUCTS, WINDOW_TYPES } from './bpglaeser/daten';
import { KalkulatorTab } from './bpglaeser/KalkulatorTab';
import inhalt from '@/content/bpglaeser/BpGlaeser.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { ModuleTabs } from '@/src/components/ui/ModuleTabs';

export default function BpGlaeser() {
  const [activeTab, setActiveTab] = useState<'uebersicht' | 'glasarten' | 'beschichtungen' | 'fenster' | 'kalkulator' | 'normen'>('uebersicht');

  // Interactive U_w Calculator state
  const [fensterBreite, setFensterBreite] = useState<number>(1.23); // m
  const [fensterHoehe, setFensterHoehe] = useState<number>(1.48); // m
  const [rahmenBreiteMm, setRahmenBreiteMm] = useState<number>(110); // mm
  const [ugWert, setUgWert] = useState<number>(0.6); // W/m²K
  const [ufWert, setUfWert] = useState<number>(1.1); // W/m²K
  const [abstandhalterTyp, setAbstandhalterTyp] = useState<'alu' | 'edelstahl' | 'warm_edge_kunststoff'>('warm_edge_kunststoff');
  const [gWert, setGWert] = useState<number>(0.53);
  const [sonneneinstrahlung, setSonneneinstrahlung] = useState<number>(450); // W/m²
  const [selectedGlassId, setSelectedGlassId] = useState<string>('isolierglas_3fach');
  const [selectedWindowId, setSelectedWindowId] = useState<string>('kunststoff_fenster');

  // U_w nach DIN EN ISO 10077-1 aus dem Rechenkern src/calc/fenster.ts
  const psiValues = PSI_ABSTANDHALTER;
  const calcResults = useMemo(() => {
    const r = uwFenster({ breite: fensterBreite, hoehe: fensterHoehe, rahmenMm: rahmenBreiteMm, ug: ugWert, uf: ufWert, psi: psiValues[abstandhalterTyp], g: gWert, strahlung: sonneneinstrahlung });
    return {
      Af_total: r.A, Ag: r.Ag, Af: r.Af, Lg: r.lg, psi: psiValues[abstandhalterTyp],
      waermestromGlas: r.phiGlas, waermestromRahmen: r.phiRahmen, waermestromKante: r.phiRand,
      uw: r.uw, solareGewinneWatt: r.solar, gegKonform: r.gegKonform, passivhausStandard: r.passivhaus, hinweise: r.hinweise,
    };
  }, [fensterBreite, fensterHoehe, rahmenBreiteMm, ugWert, ufWert, abstandhalterTyp, gWert, sonneneinstrahlung]);

  return (
    <div className="flex flex-col gap-8" id="bp-glaeser-modul">
      {/* Header Container */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-home-grau/20 pb-4">
          <div>
            <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
              <Maximize2 className="text-shiraz" size={24} /><MdText text={inhalt.texte.gläserFenstertechnikBauprodukte} /></h2>
            <p className="text-xs text-home-grau mt-1"><MdText text={inhalt.texte.bauartenGlasdickenNanobeschichtungenGasf} /></p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-shiraz/10 text-shiraz rounded-full text-xs font-bold border border-shiraz/20"><MdText text={inhalt.texte.dinEn1279Din} /></span>
          </div>
        </div>

        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-4 leading-relaxed">
          <p><MdText text={inhalt.texte.moderneFensterUndGlasfassaden} /></p>
        </div>
      </div>
      <ModuleTabs
        label={inhalt.werte.reiterBereiche}
        tabs={[
          { id: 'uebersicht' as const, label: inhalt.texte.übersichtAufbau, icon: Layers },
          { id: 'glasarten' as const, label: inhalt.texte.glasprodukteDicken, icon: ShieldCheck },
          { id: 'beschichtungen' as const, label: inhalt.texte.bedampfungSchichtenGase, icon: Sparkles },
          { id: 'fenster' as const, label: inhalt.texte.fensterartenRahmen, icon: Building2 },
          { id: 'kalkulator' as const, label: inhalt.texte.interaktiverUwRechner, icon: Calculator },
          { id: 'normen' as const, label: inhalt.texte.normenPrüfungen, icon: FileText },
        ]}
        aktiv={activeTab}
        onWechsel={setActiveTab}
        className="flex flex-col gap-8 [&>[role=tablist]]:bg-white [&>[role=tablist]]:p-4 [&>[role=tablist]]:rounded-2xl [&>[role=tablist]]:shadow-sm [&>[role=tablist]]:border [&>[role=tablist]]:border-home-grau/30"
      >

      {/* TAB 1: ÜBERSICHT & SYSTEMATIK */}
      {activeTab === 'uebersicht' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
            <h3 className="text-base font-bold text-text-main flex items-center gap-2 mb-4">
              <Zap className="text-shiraz" size={18} /><MdText text={inhalt.texte.anatomieDesModernenMehrscheiben} /></h3>
            
            <p className="text-xs text-text-main/80 leading-relaxed mb-6"><MdText text={inhalt.texte.einModernesIsolierglasBesteht} /></p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Aufbau-Visualisierung */}
              <div className="md:col-span-2 bg-off-white p-6 rounded-xl border border-home-grau/25">
                <h4 className="text-xs font-bold text-text-main uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Sliders size={14} className="text-shiraz" /><MdText text={inhalt.texte.scheibenaufbau3FachIsolierglas} /></h4>

                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3 bg-white rounded-lg border border-home-grau/30 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800"><MdText text={inhalt.texte.außenscheibePos12} /></span>
                      <p className="text-[11px] text-home-grau font-sans"><MdText text={inhalt.texte.pos1WetterseiteUnbeschichtet} /></p>
                    </div>
                    <span className="px-2 py-1 bg-slate-100 rounded text-[11px] font-bold"><MdText text={inhalt.texte.t48MmFloat} /></span>
                  </div>

                  <div className="p-2.5 bg-blue-50/70 border border-blue-200 rounded-lg text-blue-900 flex items-center justify-between">
                    <span className="font-sans font-semibold"><MdText text={inhalt.texte.scheibenzwischenraum1Szr1} /></span>
                    <span className="font-bold"><MdText text={inhalt.texte.t1418Mm90} /></span>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-home-grau/30 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800"><MdText text={inhalt.texte.mittelscheibePos34} /></span>
                      <p className="text-[11px] text-home-grau font-sans"><MdText text={inhalt.texte.pos34Meist} /></p>
                    </div>
                    <span className="px-2 py-1 bg-slate-100 rounded text-[11px] font-bold"><MdText text={inhalt.texte.t4MmFloatTvg} /></span>
                  </div>

                  <div className="p-2.5 bg-blue-50/70 border border-blue-200 rounded-lg text-blue-900 flex items-center justify-between">
                    <span className="font-sans font-semibold"><MdText text={inhalt.texte.scheibenzwischenraum2Szr2} /></span>
                    <span className="font-bold"><MdText text={inhalt.texte.t1418Mm902} /></span>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-home-grau/30 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800"><MdText text={inhalt.texte.innenscheibePos56} /></span>
                      <p className="text-[11px] text-home-grau font-sans"><MdText text={inhalt.texte.pos5LowE} /></p>
                    </div>
                    <span className="px-2 py-1 bg-slate-100 rounded text-[11px] font-bold"><MdText text={inhalt.texte.t48MmFloat2} /></span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-home-grau/20 text-xs text-text-main/70 flex items-center gap-2">
                  <Info size={14} className="text-shiraz shrink-0" />
                  <span><MdText text={inhalt.texte.merksatzDieLowE} /></span>
                </div>
              </div>

              {/* Randsiegelung */}
              <div className="bg-off-white p-5 rounded-xl border border-home-grau/25 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-text-main uppercase tracking-wider mb-3"><MdText text={inhalt.texte.derRandverbundZweistufig} /></h4>
                  <ul className="text-xs text-text-main/80 space-y-2.5 leading-relaxed">
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 size={14} className="text-shiraz shrink-0 mt-0.5" />
                      <span><MdText text={inhalt.texte.primärdichtungPolyisobutylenButylDichtet} /></span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 size={14} className="text-shiraz shrink-0 mt-0.5" />
                      <span><MdText text={inhalt.texte.abstandhalterHohlprofilMitMolekularsieb} /></span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 size={14} className="text-shiraz shrink-0 mt-0.5" />
                      <span><MdText text={inhalt.texte.sekundärdichtungPolysulfidSilikonVerkleb} /></span>
                    </li>
                  </ul>
                </div>

                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-[11px]"><MdText text={inhalt.texte.achtungKonventionelleAluminiumAbstandhal} /></div>
              </div>
            </div>
          </div>

          {/* Kennwerte-Übersichtstabelle */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
            <h3 className="text-base font-bold text-text-main mb-4 flex items-center gap-2">
              <Thermometer className="text-shiraz" size={18} /><MdText text={inhalt.texte.wichtigeBauphysikalischeKennwerteIm} /></h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-off-white border-b border-home-grau/30 text-text-main font-bold">
                    <th className="p-3">Kennwert</th>
                    <th className="p-3"><MdText text={inhalt.texte.symbolEinheit} /></th>
                    <th className="p-3"><MdText text={inhalt.texte.physikalischeBedeutung} /></th>
                    <th className="p-3"><MdText text={inhalt.texte.typischeWerteStand2026} /></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-home-grau/20 text-text-main/80">
                  <tr className="hover:bg-off-white/50">
                    <td className="p-3 font-bold text-slate-900">Glas-Wärmedurchgangskoeffizient</td>
                    <td className="p-3 font-mono font-bold text-shiraz"><MdText text={inhalt.texte.ugWMK} /></td>
                    <td className="p-3"><MdText text={inhalt.texte.gibtDenWärmeverlustDurch} /></td>
                    <td className="p-3 font-semibold"><MdText text={inhalt.texte.t2Iv11} /></td>
                  </tr>
                  <tr className="hover:bg-off-white/50">
                    <td className="p-3 font-bold text-slate-900">Rahmen-Wärmedurchgangskoeffizient</td>
                    <td className="p-3 font-mono font-bold text-shiraz"><MdText text={inhalt.texte.ufWMK} /></td>
                    <td className="p-3"><MdText text={inhalt.texte.wärmeverlustDesFensterrahmensAbhängig} /></td>
                    <td className="p-3 font-semibold"><MdText text={inhalt.texte.pvc091} /></td>
                  </tr>
                  <tr className="hover:bg-off-white/50">
                    <td className="p-3 font-bold text-slate-900">Fenster-Gesamtwert</td>
                    <td className="p-3 font-mono font-bold text-shiraz"><MdText text={inhalt.texte.uwWMK} /></td>
                    <td className="p-3"><MdText text={inhalt.texte.gesamterWärmeverlustDesFensters} /></td>
                    <td className="p-3 font-semibold"><MdText text={inhalt.texte.gegMax130} /></td>
                  </tr>
                  <tr className="hover:bg-off-white/50">
                    <td className="p-3 font-bold text-slate-900">Gesamtenergiedurchlassgrad</td>
                    <td className="p-3 font-mono font-bold text-shiraz"><MdText text={inhalt.texte.gWert} /></td>
                    <td className="p-3"><MdText text={inhalt.texte.anteilDerGesamtenSonnenenergie} /></td>
                    <td className="p-3 font-semibold"><MdText text={inhalt.texte.wärmeschutz0500} /></td>
                  </tr>
                  <tr className="hover:bg-off-white/50">
                    <td className="p-3 font-bold text-slate-900">Lichttransmissionsgrad</td>
                    <td className="p-3 font-mono font-bold text-shiraz"><MdText text={inhalt.texte.vTl} /></td>
                    <td className="p-3"><MdText text={inhalt.texte.anteilDerFürDas} /></td>
                    <td className="p-3 font-semibold"><MdText text={inhalt.texte.float903Iv} /></td>
                  </tr>
                  <tr className="hover:bg-off-white/50">
                    <td className="p-3 font-bold text-slate-900"><MdText text={inhalt.texte.lineareWärmebrückeGlasrand} /></td>
                    <td className="p-3 font-mono font-bold text-shiraz">Ψg [W/(mK)]</td>
                    <td className="p-3"><MdText text={inhalt.texte.zusatzwärmeverlustDurchDenAbstandhalter} /></td>
                    <td className="p-3 font-semibold"><MdText text={inhalt.texte.alu0080Edelstahl} /></td>
                  </tr>
                  <tr className="hover:bg-off-white/50">
                    <td className="p-3 font-bold text-slate-900"><MdText text={inhalt.texte.schallbewertetesSchalldämmmaß} /></td>
                    <td className="p-3 font-mono font-bold text-shiraz"><MdText text={inhalt.texte.rwCCtrDb} /></td>
                    <td className="p-3"><MdText text={inhalt.texte.schalldämmungGegenüberAußenlärmMit} /></td>
                    <td className="p-3 font-semibold"><MdText text={inhalt.texte.standard3234Db} /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GLASPRODUKTE & DICKEN */}
      {activeTab === 'glasarten' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {GLASS_PRODUCTS.map((prod) => (
              <div 
                key={prod.id} 
                className={`bg-white p-6 rounded-2xl shadow-sm border transition-all flex flex-col justify-between ${
                  selectedGlassId === prod.id ? 'border-shiraz ring-1 ring-shiraz' : 'border-home-grau/30 hover:border-shiraz/40'
                }`}
                onClick={() => setSelectedGlassId(prod.id)}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-off-white border border-home-grau/25 text-text-main/80">
                      {prod.standard}
                    </span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                      prod.safetyCategory.includes('Sicherheit') 
                        ? 'bg-shiraz/10 text-shiraz border border-shiraz/30' 
                        : prod.safetyCategory.includes('Teilvorgespannt')
                          ? 'bg-blue-50 text-blue-800 border border-blue-200'
                          : 'bg-slate-100 text-slate-800 border border-slate-200'
                    }`}>
                      {prod.safetyCategory}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-text-main leading-snug">
                    {prod.name}
                  </h3>

                  <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-home-grau/15 text-xs">
                    <div>
                      <span className="text-home-grau text-[10px] uppercase font-bold block">Dickenbereich:</span>
                      <span className="font-semibold text-text-main">{prod.thicknessRange}</span>
                    </div>
                    <div>
                      <span className="text-home-grau text-[10px] uppercase font-bold block"><MdText text={inhalt.texte.typischeDicken} /></span>
                      <span className="font-semibold text-text-main">{prod.typicalThickness}</span>
                    </div>
                    <div>
                      <span className="text-home-grau text-[10px] uppercase font-bold block">U_g-Bereich:</span>
                      <span className="font-bold text-shiraz">{prod.uValueRange}</span>
                    </div>
                    <div>
                      <span className="text-home-grau text-[10px] uppercase font-bold block"><MdText text={inhalt.texte.richtpreisGlas} /></span>
                      <span className="font-bold text-emerald-800">{prod.pricePerSqm}</span>
                    </div>
                  </div>

                  <p className="text-xs text-text-main/80 mt-3 leading-relaxed">
                    {prod.production}
                  </p>

                  <div className="mt-3 bg-off-white p-3 rounded-xl border border-home-grau/20 text-xs">
                    <strong className="text-slate-900 block mb-1"><MdText text={inhalt.texte.typischeEinsatzbereiche} /></strong>
                    <ul className="list-disc pl-4 space-y-0.5 text-text-main/75 text-[11px]">
                      {prod.applications.map((app, i) => (
                        <li key={i}>{app}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-home-grau/20 flex items-center justify-between text-xs">
                  <div className="text-[11px] text-home-grau font-mono">
                    Schallschutz: {prod.soundRw}
                  </div>
                  <button 
                    onClick={() => {
                      if (prod.id === 'isolierglas_2fach') { setUgWert(1.1); setGWert(0.62); }
                      if (prod.id === 'isolierglas_3fach') { setUgWert(0.6); setGWert(0.53); }
                      if (prod.id === 'sonnenschutzglas') { setUgWert(0.8); setGWert(0.28); }
                      if (prod.id === 'vakuumisolierglas') { setUgWert(0.5); setGWert(0.58); }
                      setActiveTab('kalkulator');
                    }}
                    className="text-shiraz font-bold flex items-center gap-1 hover:underline"
                  ><MdText text={inhalt.texte.imRechnerTesten} /><ChevronRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Bruchbilder & Sicherheitsklassen-Erklärung */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
            <h3 className="text-base font-bold text-text-main flex items-center gap-2 mb-3">
              <AlertTriangle className="text-amber-600" size={18} /><MdText text={inhalt.texte.bruchmechanikPersonensicherheitFloatglas} /></h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="bg-off-white p-4 rounded-xl border border-home-grau/25">
                <h4 className="font-bold text-slate-900 mb-1 text-sm"><MdText text={inhalt.texte.floatglasKühlglas} /></h4>
                <div className="text-shiraz font-bold text-xs mb-2"><MdText text={inhalt.texte.fK45N} /></div>
                <p className="text-text-main/80 text-[11px] leading-relaxed"><MdText text={inhalt.texte.brichtInGroßeScharfkantige} /></p>
              </div>

              <div className="bg-off-white p-4 rounded-xl border border-home-grau/25">
                <h4 className="font-bold text-slate-900 mb-1 text-sm"><MdText text={inhalt.texte.esgVollVorgespannt} /></h4>
                <div className="text-shiraz font-bold text-xs mb-2"><MdText text={inhalt.texte.fK120N} /></div>
                <p className="text-text-main/80 text-[11px] leading-relaxed"><MdText text={inhalt.texte.hoheEigenspannungZerfälltBei} /></p>
              </div>

              <div className="bg-off-white p-4 rounded-xl border border-home-grau/25">
                <h4 className="font-bold text-slate-900 mb-1 text-sm"><MdText text={inhalt.texte.tvgTeilvorgespannt} /></h4>
                <div className="text-shiraz font-bold text-xs mb-2"><MdText text={inhalt.texte.fK70N} /></div>
                <p className="text-text-main/80 text-[11px] leading-relaxed"><MdText text={inhalt.texte.brichtInGroßformatigeIneinander} /></p>
              </div>

              <div className="bg-off-white p-4 rounded-xl border border-home-grau/25">
                <h4 className="font-bold text-slate-900 mb-1 text-sm"><MdText text={inhalt.texte.vsgVerbundglas} /></h4>
                <div className="text-shiraz font-bold text-xs mb-2"><MdText text={inhalt.texte.splitterbindendZäh} /></div>
                <p className="text-text-main/80 text-[11px] leading-relaxed"><MdText text={inhalt.texte.mindestensZweiScheibenMit} /></p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: BESCHICHTUNGEN, BEDAMPFUNGEN & GASE */}
      {activeTab === 'beschichtungen' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
            <h3 className="text-base font-bold text-text-main flex items-center gap-2 mb-4">
              <Sparkles className="text-shiraz" size={18} /><MdText text={inhalt.texte.nanobeschichtungenBedampfungsverfahrenAu} /></h3>

            <p className="text-xs text-text-main/80 leading-relaxed mb-6"><MdText text={inhalt.texte.reinesGlasBesitztEin} /></p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Sputtern vs Pyrolyse */}
              <div className="bg-off-white p-5 rounded-xl border border-home-grau/25">
                <h4 className="text-xs font-bold text-text-main uppercase tracking-wider mb-3"><MdText text={inhalt.texte.t1MagnetronSputternOffline} /></h4>
                <p className="text-xs text-text-main/80 leading-relaxed mb-3"><MdText text={inhalt.texte.dasModerneHochleistungsverfahrenIm} /></p>
                <div className="bg-white p-3 rounded-lg border border-home-grau/20 text-xs">
                  <span className="font-bold text-shiraz block mb-1"><MdText text={inhalt.texte.schichtaufbauSilberMultilayer} /></span>
                  <p className="text-[11px] text-text-main/80"><MdText text={inhalt.texte.glasDielektrikumEntspiegelungSilber} /></p>
                </div>
                <div className="mt-3 text-[11px] text-home-grau"><MdText text={inhalt.texte.einschränkungNichtWitterungsstabilMuss} /></div>
              </div>

              <div className="bg-off-white p-5 rounded-xl border border-home-grau/25">
                <h4 className="text-xs font-bold text-text-main uppercase tracking-wider mb-3"><MdText text={inhalt.texte.t2PyrolytischeBeschichtungOnline} /></h4>
                <p className="text-xs text-text-main/80 leading-relaxed mb-3"><MdText text={inhalt.texte.erfolgtDirektImFloatglas} /></p>
                <div className="bg-white p-3 rounded-lg border border-home-grau/20 text-xs">
                  <span className="font-bold text-slate-800 block mb-1">Eigenschaften:</span>
                  <p className="text-[11px] text-text-main/80"><MdText text={inhalt.texte.mechanischUndChemischSehr} /></p>
                </div>
                <div className="mt-3 text-[11px] text-home-grau"><MdText text={inhalt.texte.anwendungSelbstreinigendeGläserTio} /></div>
              </div>
            </div>
          </div>

          {/* Gasfüllungen im Scheibenzwischenraum */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
            <h3 className="text-base font-bold text-text-main flex items-center gap-2 mb-4">
              <Zap className="text-shiraz" size={18} /><MdText text={inhalt.texte.gasfüllungenImScheibenzwischenraumSzr} /></h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-off-white border-b border-home-grau/30 text-text-main font-bold">
                    <th className="p-3">Gasart</th>
                    <th className="p-3"><MdText text={inhalt.texte.wärmeleitfähigkeitBei10C} /></th>
                    <th className="p-3"><MdText text={inhalt.texte.dichteKgM} /></th>
                    <th className="p-3"><MdText text={inhalt.texte.optimalerSzrAbstand} /></th>
                    <th className="p-3"><MdText text={inhalt.texte.erreichbarerUg3Iv} /></th>
                    <th className="p-3"><MdText text={inhalt.texte.kostenVerfügbarkeit} /></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-home-grau/20 text-text-main/80">
                  <tr className="hover:bg-off-white/50">
                    <td className="p-3 font-bold text-slate-800"><MdText text={inhalt.texte.luftTrocken} /></td>
                    <td className="p-3 font-mono"><MdText text={inhalt.texte.t00250WMk} /></td>
                    <td className="p-3 font-mono">1,24</td>
                    <td className="p-3">16 mm</td>
                    <td className="p-3 font-bold text-slate-700"><MdText text={inhalt.texte.t09WM} /></td>
                    <td className="p-3 text-emerald-700"><MdText text={inhalt.texte.kostenlosHeuteNurNoch} /></td>
                  </tr>
                  <tr className="hover:bg-off-white/50 bg-shiraz/5">
                    <td className="p-3 font-bold text-shiraz"><MdText text={inhalt.texte.argonAr90Industriestandard} /></td>
                    <td className="p-3 font-mono font-bold text-shiraz"><MdText text={inhalt.texte.t00170WMk} /></td>
                    <td className="p-3 font-mono">1,70</td>
                    <td className="p-3 font-semibold">14 – 16 mm</td>
                    <td className="p-3 font-bold text-shiraz"><MdText text={inhalt.texte.t0607} /></td>
                    <td className="p-3 font-bold text-emerald-800"><MdText text={inhalt.texte.sehrGünstig093} /></td>
                  </tr>
                  <tr className="hover:bg-off-white/50">
                    <td className="p-3 font-bold text-blue-900"><MdText text={inhalt.texte.kryptonKr90} /></td>
                    <td className="p-3 font-mono font-bold text-blue-900"><MdText text={inhalt.texte.t00094WMk} /></td>
                    <td className="p-3 font-mono">3,56</td>
                    <td className="p-3 font-semibold">10 – 12 mm</td>
                    <td className="p-3 font-bold text-blue-900">0,5 W/(m²K)</td>
                    <td className="p-3 text-amber-800"><MdText text={inhalt.texte.teuerFürSchmaleScheibenzwischenräume} /></td>
                  </tr>
                  <tr className="hover:bg-off-white/50">
                    <td className="p-3 font-bold text-purple-900">Xenon (Xe)</td>
                    <td className="p-3 font-mono font-bold text-purple-900"><MdText text={inhalt.texte.t00056WMk} /></td>
                    <td className="p-3 font-mono">5,59</td>
                    <td className="p-3 font-semibold">6 – 8 mm</td>
                    <td className="p-3 font-bold text-purple-900"><MdText text={inhalt.texte.t04WM} /></td>
                    <td className="p-3 text-red-700"><MdText text={inhalt.texte.sehrTeuerImBauwesen} /></td>
                  </tr>
                  <tr className="hover:bg-off-white/50 bg-amber-50/50">
                    <td className="p-3 font-bold text-amber-900"><MdText text={inhalt.texte.vakuumP01} /></td>
                    <td className="p-3 font-mono font-bold text-amber-900"><MdText text={inhalt.texte.t00000WMk} /></td>
                    <td className="p-3 font-mono">~ 0,00</td>
                    <td className="p-3 font-bold text-amber-900"><MdText text={inhalt.texte.t0203} /></td>
                    <td className="p-3 font-bold text-amber-900"><MdText text={inhalt.texte.t0407} /></td>
                    <td className="p-3 text-amber-900"><MdText text={inhalt.texte.aufwendigeRandversiegelungZukunftstechno} /></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-4 p-4 bg-off-white rounded-xl border border-home-grau/25 text-xs text-text-main/80 flex items-start gap-2">
              <Info size={16} className="text-shiraz shrink-0 mt-0.5" />
              <div><MdText text={inhalt.texte.diffusionsverlustÜberDieLebensdauer} /></div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: FENSTERARTEN & RAHMENMATERIALIEN */}
      {activeTab === 'fenster' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {WINDOW_TYPES.map((win) => (
              <div 
                key={win.id}
                className={`bg-white p-6 rounded-2xl shadow-sm border transition-all flex flex-col justify-between ${
                  selectedWindowId === win.id ? 'border-shiraz ring-1 ring-shiraz' : 'border-home-grau/30 hover:border-shiraz/40'
                }`}
                onClick={() => setSelectedWindowId(win.id)}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-off-white border border-home-grau/25 text-slate-800">
                      Rahmen: {win.frameMaterial}
                    </span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                      Einbruchschutz: {win.resistanceClassRC}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-text-main leading-snug">
                    {win.name}
                  </h3>

                  <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-home-grau/15 text-xs">
                    <div>
                      <span className="text-home-grau text-[10px] uppercase font-bold block"><MdText text={inhalt.texte.typischerUwWert} /></span>
                      <span className="font-bold text-shiraz text-sm">{formatDeWert(win.typicalUw)} W/(m²K)</span>
                    </div>
                    <div>
                      <span className="text-home-grau text-[10px] uppercase font-bold block"><MdText text={inhalt.texte.richtpreisElement} /></span>
                      <span className="font-bold text-emerald-800 text-sm">~ {formatDeWert(win.typicalPricePerSqm)} €/m²</span>
                    </div>
                    <div>
                      <span className="text-home-grau text-[10px] uppercase font-bold block">Schallschutz:</span>
                      <span className="font-semibold text-text-main">{win.soundProtectionClass}</span>
                    </div>
                    <div>
                      <span className="text-home-grau text-[10px] uppercase font-bold block">Schlagregendichtheit:</span>
                      <span className="font-semibold text-text-main">{win.waterTightnessClass}</span>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2 text-xs">
                    <div>
                      <strong className="text-emerald-800 text-[11px] block">Vorteile:</strong>
                      <ul className="list-disc pl-4 text-text-main/80 space-y-0.5 text-[11px]">
                        {win.pros.map((p, idx) => <li key={idx}>{p}</li>)}
                      </ul>
                    </div>

                    <div>
                      <strong className="text-amber-800 text-[11px] block">Einschränkungen:</strong>
                      <ul className="list-disc pl-4 text-text-main/80 space-y-0.5 text-[11px]">
                        {win.cons.map((c, idx) => <li key={idx}>{c}</li>)}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-home-grau/20 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-home-grau font-mono">
                    {win.normen.join(' • ')}
                  </span>
                  <button 
                    onClick={() => {
                      if (win.id === 'kunststoff_fenster') { setUfWert(1.1); setRahmenBreiteMm(115); }
                      if (win.id === 'holz_fenster') { setUfWert(1.2); setRahmenBreiteMm(110); }
                      if (win.id === 'holz_alu_fenster') { setUfWert(1.0); setRahmenBreiteMm(110); }
                      if (win.id === 'alu_fenster') { setUfWert(1.2); setRahmenBreiteMm(95); }
                      if (win.id === 'kastenfenster') { setUfWert(1.4); setRahmenBreiteMm(140); setUgWert(1.1); }
                      setActiveTab('kalkulator');
                    }}
                    className="text-shiraz font-bold flex items-center gap-1 hover:underline"
                  ><MdText text={inhalt.texte.geometrieSimulieren} /><ChevronRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Rahmenmaterialien im Lebenszyklusvergleich */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
            <h3 className="text-base font-bold text-text-main flex items-center gap-2 mb-3">
              <Compass className="text-shiraz" size={18} /><MdText text={inhalt.texte.ökologischeTechnischeLebenszyklusbetrach} /></h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
              <div className="bg-off-white p-4 rounded-xl border border-home-grau/25">
                <h4 className="font-bold text-slate-900 mb-1"><MdText text={inhalt.texte.kunststoffPvcU} /></h4>
                <p className="text-text-main/80 text-[11px] leading-relaxed"><MdText text={inhalt.texte.geringsteAnschaffungskostenLebensdauer30} /></p>
              </div>

              <div className="bg-off-white p-4 rounded-xl border border-home-grau/25">
                <h4 className="font-bold text-slate-900 mb-1"><MdText text={inhalt.texte.holzKieferEiche} /></h4>
                <p className="text-text-main/80 text-[11px] leading-relaxed"><MdText text={inhalt.texte.besteCoBilanzAller} /></p>
              </div>

              <div className="bg-off-white p-4 rounded-xl border border-home-grau/25">
                <h4 className="font-bold text-slate-900 mb-1">Holz-Aluminium</h4>
                <p className="text-text-main/80 text-[11px] leading-relaxed"><MdText text={inhalt.texte.höchsteLebensdauer45Jahre} /></p>
              </div>

              <div className="bg-off-white p-4 rounded-xl border border-home-grau/25">
                <h4 className="font-bold text-slate-900 mb-1">Aluminium</h4>
                <p className="text-text-main/80 text-[11px] leading-relaxed"><MdText text={inhalt.texte.hohePrimärenergieBeiNeualuminium} /></p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: INTERAKTIVER UW-RECHNER */}
      {activeTab === 'kalkulator' && (
        <KalkulatorTab fensterBreite={fensterBreite} setFensterBreite={setFensterBreite} fensterHoehe={fensterHoehe} setFensterHoehe={setFensterHoehe} rahmenBreiteMm={rahmenBreiteMm} setRahmenBreiteMm={setRahmenBreiteMm} ufWert={ufWert} setUfWert={setUfWert} ugWert={ugWert} setUgWert={setUgWert} abstandhalterTyp={abstandhalterTyp} setAbstandhalterTyp={setAbstandhalterTyp} gWert={gWert} setGWert={setGWert} sonneneinstrahlung={sonneneinstrahlung} setSonneneinstrahlung={setSonneneinstrahlung} calcResults={calcResults} />
      )}

      {/* TAB 6: NORMEN & PRÜFVERFAHREN */}
      {activeTab === 'normen' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
            <h3 className="text-base font-bold text-text-main flex items-center gap-2 mb-4">
              <FileText className="text-shiraz" size={18} /><MdText text={inhalt.texte.relevanteNormenPrüfungenFür} /></h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-off-white p-5 rounded-xl border border-home-grau/25">
                <h4 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-1.5">
                  <ShieldCheck size={16} className="text-shiraz" /><MdText text={inhalt.texte.t1BemessungImBauwesen} /></h4>
                <ul className="text-xs text-text-main/80 space-y-2 leading-relaxed">
                  <li><MdText text={inhalt.texte.din180081Begriffe} /></li>
                  <li><MdText text={inhalt.texte.din180082Linienförmig} /></li>
                  <li><MdText text={inhalt.texte.din180083Punktförmig} /></li>
                  <li><MdText text={inhalt.texte.din180084Zusatzanforderungen} /></li>
                  <li><MdText text={inhalt.texte.din180085Begehbare} /></li>
                </ul>
              </div>

              <div className="bg-off-white p-5 rounded-xl border border-home-grau/25">
                <h4 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-1.5">
                  <CheckCircle2 size={16} className="text-shiraz" /><MdText text={inhalt.texte.t2ProduktnormenCeKennzeichnung} /></h4>
                <ul className="text-xs text-text-main/80 space-y-2 leading-relaxed">
                  <li><MdText text={inhalt.texte.dinEn143511} /></li>
                  <li><MdText text={inhalt.texte.dinEn1279Teile} /></li>
                  <li><MdText text={inhalt.texte.dinEn12150Thermisch} /></li>
                  <li><MdText text={inhalt.texte.dinEnIso12543} /></li>
                  <li><MdText text={inhalt.texte.dinEnIso10077} /></li>
                </ul>
              </div>
            </div>

            {/* Prüfmethoden Prüfstand */}
            <div className="mt-6 bg-off-white p-5 rounded-xl border border-home-grau/25">
              <h4 className="font-bold text-slate-900 text-sm mb-3"><MdText text={inhalt.texte.zertifizierungsPrüfungenAmFensterprüfsta} /></h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="bg-white p-3.5 rounded-lg border border-home-grau/20">
                  <span className="font-bold text-slate-800 block mb-1"><MdText text={inhalt.texte.t1LuftdurchlässigkeitDinEn} /></span>
                  <p className="text-[11px] text-text-main/75"><MdText text={inhalt.texte.druckstufenBis600Pa} /></p>
                </div>
                <div className="bg-white p-3.5 rounded-lg border border-home-grau/20">
                  <span className="font-bold text-slate-800 block mb-1"><MdText text={inhalt.texte.t2SchlagregendichtheitDinEn} /></span>
                  <p className="text-[11px] text-text-main/75"><MdText text={inhalt.texte.berieselungMitWasserBei} /></p>
                </div>
                <div className="bg-white p-3.5 rounded-lg border border-home-grau/20">
                  <span className="font-bold text-slate-800 block mb-1"><MdText text={inhalt.texte.t3EinbruchhemmungDinEn} /></span>
                  <p className="text-[11px] text-text-main/75"><MdText text={inhalt.texte.widerstandsklassenRc1N} /></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      </ModuleTabs>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <FormulaDerivationBox
          title={inhalt.werte.anwendungsbeispielBemessungsfestigkeitVo}
          zielGleichung="f_{g,d} = \frac{k_{mod} \cdot k_c \cdot f_{g,k}}{\gamma_M}"
          normQuelle={inhalt.werte.din180081Und}
          schritte={inhalt.daten["BpGlaeser.schritte"]}
          ergebnisHinweis={inhalt.werte.esgHatRundDie}
        />
      </div>

      <ModulTest moduleId="bp_glaeser" />

      {/* Standardisierter Footer */}
      <ModuleFooter
        wikipedia={[
          { title: 'Flachglas', url: 'https://de.wikipedia.org/wiki/Flachglas' },
          { title: 'Mehrscheiben-Isolierglas', url: 'https://de.wikipedia.org/wiki/Mehrscheiben-Isolierglas' },
          { title: 'Sicherheitsglas', url: 'https://de.wikipedia.org/wiki/Sicherheitsglas' },
          { title: 'Fenster', url: 'https://de.wikipedia.org/wiki/Fenster' }
        ]}
        regelwerke={inhalt.daten["BpGlaeser.regelwerke"]}
        literatur={inhalt.daten["BpGlaeser.literatur"]}
        weblinks={inhalt.daten["BpGlaeser.weblinks"]}
        formeln={inhalt.daten["BpGlaeser.formeln"]}
      />
    </div>
  );
}
