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
              <Maximize2 className="text-shiraz" size={24} /> Gläser & Fenstertechnik (Bauprodukte)
            </h2>
            <p className="text-xs text-home-grau mt-1">
              Bauarten, Glasdicken, Nanobeschichtungen, Gasfüllungen, Fensterprofile, Normen &amp; Kostenanalysen
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-shiraz/10 text-shiraz rounded-full text-xs font-bold border border-shiraz/20">
              DIN EN 1279 • DIN 18008 • GModG (vormals GEG)
            </span>
          </div>
        </div>

        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-4 leading-relaxed">
          <p>
            Moderne Fenster und Glasfassaden sind hochkomplexe multifunktionale Bauteilsysteme. Sie verbinden Tageslichtnutzung 
            mit extremem Wärmeschutz (<InlineMath math="U_w \le 0{,}80\,\text{W}/(\text{m}^2\text{K})" />), 
            sommerlicher Hitzeabschirmung (<InlineMath math="g\text{-Wert}" />), Schallschutz (<InlineMath math="R_w \ge 45\,\text{dB}" />) 
            und statischer Personensicherheit nach <strong>DIN 18008</strong>. Hier erfahren Sie die physikalischen Wirkungsweisen 
            von Low-E-Beschichtungen, Scheibenzwischenraum-Füllungen, Sicherheitsgläsern und Rahmenmaterialien.
          </p>
        </div>

        {/* Tab-Navigation */}
        <div className="flex flex-wrap gap-2 pt-6 border-t border-home-grau/20 mt-4">
          <button aria-pressed={activeTab === 'uebersicht'}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'uebersicht' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('uebersicht')}
          >
            <Layers size={16} /> Übersicht &amp; Aufbau
          </button>

          <button aria-pressed={activeTab === 'glasarten'}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'glasarten' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('glasarten')}
          >
            <ShieldCheck size={16} /> Glasprodukte &amp; Dicken
          </button>

          <button aria-pressed={activeTab === 'beschichtungen'}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'beschichtungen' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('beschichtungen')}
          >
            <Sparkles size={16} /> Bedampfung, Schichten &amp; Gase
          </button>

          <button aria-pressed={activeTab === 'fenster'}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'fenster' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('fenster')}
          >
            <Building2 size={16} /> Fensterarten &amp; Rahmen
          </button>

          <button aria-pressed={activeTab === 'kalkulator'}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'kalkulator' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('kalkulator')}
          >
            <Calculator size={16} /> Interaktiver Uw-Rechner
          </button>

          <button aria-pressed={activeTab === 'normen'}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'normen' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
            onClick={() => setActiveTab('normen')}
          >
            <FileText size={16} /> Normen &amp; Prüfungen
          </button>
        </div>
      </div>

      {/* TAB 1: ÜBERSICHT & SYSTEMATIK */}
      {activeTab === 'uebersicht' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
            <h3 className="text-base font-bold text-text-main flex items-center gap-2 mb-4">
              <Zap className="text-shiraz" size={18} />
              Anatomie des modernen Mehrscheiben-Isolierglases (MIG nach DIN EN 1279)
            </h3>
            
            <p className="text-xs text-text-main/80 leading-relaxed mb-6">
              Ein modernes Isolierglas besteht aus weit mehr als nur zwei Glasscheiben. Es ist ein hermetisch abgeschlossener, 
              gasgefüllter Hohlkörper mit Nanobeschichtungen und hochpräziser Randsiegelung. 
              Die Bezeichnungsweise der Glasoberflächen erfolgt immer von <strong>außen nach innen</strong> mit den Ziffern 1 bis 4 (bei 2-fach) 
              bzw. 1 bis 6 (bei 3-fach Verglasung).
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Aufbau-Visualisierung */}
              <div className="md:col-span-2 bg-off-white p-6 rounded-xl border border-home-grau/25">
                <h4 className="text-xs font-bold text-text-main uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Sliders size={14} className="text-shiraz" /> Scheibenaufbau 3-fach Isolierglas (Position 1 bis 6)
                </h4>

                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3 bg-white rounded-lg border border-home-grau/30 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800">Außenscheibe (Pos. 1 &amp; 2)</span>
                      <p className="text-[11px] text-home-grau font-sans">Pos. 1: Wetterseite unbeschichtet | Pos. 2: Sonnenschutz-Bedampfung (optional)</p>
                    </div>
                    <span className="px-2 py-1 bg-slate-100 rounded text-[11px] font-bold">4 – 8 mm Float/ESG</span>
                  </div>

                  <div className="p-2.5 bg-blue-50/70 border border-blue-200 rounded-lg text-blue-900 flex items-center justify-between">
                    <span className="font-sans font-semibold">Scheibenzwischenraum 1 (SZR 1)</span>
                    <span className="font-bold">14 – 18 mm (90 % Argon / Krypton)</span>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-home-grau/30 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800">Mittelscheibe (Pos. 3 &amp; 4)</span>
                      <p className="text-[11px] text-home-grau font-sans">Pos. 3 / 4: Meist unbeschichtet oder zusätzliche Funktionsschicht</p>
                    </div>
                    <span className="px-2 py-1 bg-slate-100 rounded text-[11px] font-bold">4 mm Float/TVG</span>
                  </div>

                  <div className="p-2.5 bg-blue-50/70 border border-blue-200 rounded-lg text-blue-900 flex items-center justify-between">
                    <span className="font-sans font-semibold">Scheibenzwischenraum 2 (SZR 2)</span>
                    <span className="font-bold">14 – 18 mm (90 % Argon / Krypton)</span>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-home-grau/30 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800">Innenscheibe (Pos. 5 &amp; 6)</span>
                      <p className="text-[11px] text-home-grau font-sans">Pos. 5: Low-E-Wärmeschutzschicht (Silber) | Pos. 6: Raumseite (VSG bei Absturzsicherung)</p>
                    </div>
                    <span className="px-2 py-1 bg-slate-100 rounded text-[11px] font-bold">4 – 8 mm Float/VSG</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-home-grau/20 text-xs text-text-main/70 flex items-center gap-2">
                  <Info size={14} className="text-shiraz shrink-0" />
                  <span><strong>Merksatz:</strong> Die Low-E-Schicht liegt geschützt im Zwischenraum (Pos. 3 bei 2-IV, Pos. 2 &amp; 5 bei 3-IV), niemals frei auf der Außenseite, um Oxidation zu verhindern.</span>
                </div>
              </div>

              {/* Randsiegelung */}
              <div className="bg-off-white p-5 rounded-xl border border-home-grau/25 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-text-main uppercase tracking-wider mb-3">
                    Der Randverbund (Zweistufig)
                  </h4>
                  <ul className="text-xs text-text-main/80 space-y-2.5 leading-relaxed">
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 size={14} className="text-shiraz shrink-0 mt-0.5" />
                      <span><strong>Primärdichtung (Polyisobutylen / Butyl):</strong> Dichtet gegen Gasaustritt und verhindert das Eindringen von Wasserdampf (Diffusionssperre).</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 size={14} className="text-shiraz shrink-0 mt-0.5" />
                      <span><strong>Abstandhalter:</strong> Hohlprofil mit Molekularsieb (Zeolith-Trocknungsmittel) bindet eventuelle Restfeuchte.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 size={14} className="text-shiraz shrink-0 mt-0.5" />
                      <span><strong>Sekundärdichtung (Polysulfid / Silikon):</strong> Verklebt die Scheiben mechanisch elastisch im Kantenbereich (3–5 mm Tiefe).</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-[11px]">
                  <strong>Achtung:</strong> Konventionelle Aluminium-Abstandhalter bilden eine massive Kältebrücke (<InlineMath math="\Psi \approx 0{,}08\,\text{W}/(\text{mK})" />). 
                  Standard ist heute die <strong>"Warme Kante"</strong> aus Kunststoff/Edelstahl (<InlineMath math="\Psi \le 0{,}04\,\text{W}/(\text{mK})" />).
                </div>
              </div>
            </div>
          </div>

          {/* Kennwerte-Übersichtstabelle */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
            <h3 className="text-base font-bold text-text-main mb-4 flex items-center gap-2">
              <Thermometer className="text-shiraz" size={18} />
              Wichtige bauphysikalische Kennwerte im Fensterbau
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-off-white border-b border-home-grau/30 text-text-main font-bold">
                    <th className="p-3">Kennwert</th>
                    <th className="p-3">Symbol / Einheit</th>
                    <th className="p-3">Physikalische Bedeutung</th>
                    <th className="p-3">Typische Werte (Stand 2026)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-home-grau/20 text-text-main/80">
                  <tr className="hover:bg-off-white/50">
                    <td className="p-3 font-bold text-slate-900">Glas-Wärmedurchgangskoeffizient</td>
                    <td className="p-3 font-mono font-bold text-shiraz">Ug [W/(m²K)]</td>
                    <td className="p-3">Gibt den Wärmeverlust durch das Verbundglas an (je kleiner, desto besser dämmend).</td>
                    <td className="p-3 font-semibold">2-IV: 1,1 | 3-IV: 0,5 – 0,7 | VIG: 0,5</td>
                  </tr>
                  <tr className="hover:bg-off-white/50">
                    <td className="p-3 font-bold text-slate-900">Rahmen-Wärmedurchgangskoeffizient</td>
                    <td className="p-3 font-mono font-bold text-shiraz">Uf [W/(m²K)]</td>
                    <td className="p-3">Wärmeverlust des Fensterrahmens (abhängig von Kammern, Holzstärke, thermischer Trennung).</td>
                    <td className="p-3 font-semibold">PVC: 0,9–1,2 | Holz: 1,1–1,3 | Alu: 1,1–1,4</td>
                  </tr>
                  <tr className="hover:bg-off-white/50">
                    <td className="p-3 font-bold text-slate-900">Fenster-Gesamtwert</td>
                    <td className="p-3 font-mono font-bold text-shiraz">Uw [W/(m²K)]</td>
                    <td className="p-3">Gesamter Wärmeverlust des Fensters inkl. Glas, Rahmen und Glasrandverbund (<InlineMath math="\Psi_g" />).</td>
                    <td className="p-3 font-semibold">GEG-Max: 1,30 | Standard: 0,80 – 0,95</td>
                  </tr>
                  <tr className="hover:bg-off-white/50">
                    <td className="p-3 font-bold text-slate-900">Gesamtenergiedurchlassgrad</td>
                    <td className="p-3 font-mono font-bold text-shiraz">g-Wert [- / %]</td>
                    <td className="p-3">Anteil der gesamten Sonnenenergie, die durch das Glas in den Raum gelangt (0 bis 1).</td>
                    <td className="p-3 font-semibold">Wärmeschutz: 0,50–0,62 | Sonnenschutz: 0,22–0,38</td>
                  </tr>
                  <tr className="hover:bg-off-white/50">
                    <td className="p-3 font-bold text-slate-900">Lichttransmissionsgrad</td>
                    <td className="p-3 font-mono font-bold text-shiraz">τ_v (TL) [%]</td>
                    <td className="p-3">Anteil der für das menschliche Auge sichtbaren Sonnenstrahlung (380–780 nm).</td>
                    <td className="p-3 font-semibold">Float: ~90 % | 3-IV: 70–75 % | Sonnenschutz: 50–70 %</td>
                  </tr>
                  <tr className="hover:bg-off-white/50">
                    <td className="p-3 font-bold text-slate-900">Lineare Wärmebrücke Glasrand</td>
                    <td className="p-3 font-mono font-bold text-shiraz">Ψg [W/(mK)]</td>
                    <td className="p-3">Zusatzwärmeverlust durch den Abstandhalter im Randverbund des Isolierglases.</td>
                    <td className="p-3 font-semibold">Alu: 0,080 | Edelstahl: 0,060 | Warme Kante: 0,035–0,040</td>
                  </tr>
                  <tr className="hover:bg-off-white/50">
                    <td className="p-3 font-bold text-slate-900">Schallbewertetes Schalldämmmaß</td>
                    <td className="p-3 font-mono font-bold text-shiraz">Rw (C; Ctr) [dB]</td>
                    <td className="p-3">Schalldämmung gegenüber Außenlärm mit Spektrum-Anpassungswerten für Stadtverkehr (Ctr).</td>
                    <td className="p-3 font-semibold">Standard: 32–34 dB | Akustik-VSG: 42–48 dB</td>
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
                      <span className="text-home-grau text-[10px] uppercase font-bold block">Typische Dicken:</span>
                      <span className="font-semibold text-text-main">{prod.typicalThickness}</span>
                    </div>
                    <div>
                      <span className="text-home-grau text-[10px] uppercase font-bold block">U_g-Bereich:</span>
                      <span className="font-bold text-shiraz">{prod.uValueRange}</span>
                    </div>
                    <div>
                      <span className="text-home-grau text-[10px] uppercase font-bold block">Richtpreis (Glas):</span>
                      <span className="font-bold text-emerald-800">{prod.pricePerSqm}</span>
                    </div>
                  </div>

                  <p className="text-xs text-text-main/80 mt-3 leading-relaxed">
                    {prod.production}
                  </p>

                  <div className="mt-3 bg-off-white p-3 rounded-xl border border-home-grau/20 text-xs">
                    <strong className="text-slate-900 block mb-1">Typische Einsatzbereiche:</strong>
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
                  >
                    Im Rechner testen <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Bruchbilder & Sicherheitsklassen-Erklärung */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
            <h3 className="text-base font-bold text-text-main flex items-center gap-2 mb-3">
              <AlertTriangle className="text-amber-600" size={18} />
              Bruchmechanik &amp; Personensicherheit: Floatglas vs. ESG vs. TVG vs. VSG
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="bg-off-white p-4 rounded-xl border border-home-grau/25">
                <h4 className="font-bold text-slate-900 mb-1 text-sm">Floatglas (Kühlglas)</h4>
                <div className="text-shiraz font-bold text-xs mb-2">f_k = 45 N/mm²</div>
                <p className="text-text-main/80 text-[11px] leading-relaxed">
                  Bricht in große, scharfkantige Bruchstücke. 
                  <strong>Nicht zulässig</strong> als alleinige Glasart für absturzsichernde Verglasungen (DIN 18008-4).
                </p>
              </div>

              <div className="bg-off-white p-4 rounded-xl border border-home-grau/25">
                <h4 className="font-bold text-slate-900 mb-1 text-sm">ESG (Voll vorgespannt)</h4>
                <div className="text-shiraz font-bold text-xs mb-2">f_k = 120 N/mm²</div>
                <p className="text-text-main/80 text-[11px] leading-relaxed">
                  Hohe Eigenspannung. Zerfällt bei Bruch schlagartig in tausende stumpfkantige Krümel (&lt; 1 cm²). 
                  Gefahrlose Bergung, aber <strong>keine Resttragfähigkeit</strong> (Scheibe fällt komplett heraus).
                </p>
              </div>

              <div className="bg-off-white p-4 rounded-xl border border-home-grau/25">
                <h4 className="font-bold text-slate-900 mb-1 text-sm">TVG (Teilvorgespannt)</h4>
                <div className="text-shiraz font-bold text-xs mb-2">f_k = 70 N/mm²</div>
                <p className="text-text-main/80 text-[11px] leading-relaxed">
                  Bricht in großformatige, ineinander verkrallte Schollen. Nur im VSG-Verbund zulässig! 
                  Garantiert sehr gute <strong>statische Resttragfähigkeit</strong> bei Überkopf- und Brüstungsgläsern.
                </p>
              </div>

              <div className="bg-off-white p-4 rounded-xl border border-home-grau/25">
                <h4 className="font-bold text-slate-900 mb-1 text-sm">VSG (Verbundglas)</h4>
                <div className="text-shiraz font-bold text-xs mb-2">Splitterbindend + Zäh</div>
                <p className="text-text-main/80 text-[11px] leading-relaxed">
                  Mindestens zwei Scheiben mit zäher PVB-Folie (0,38 bis 1,52 mm). 
                  Splitter haften fest an der Folie; schützt vor Absturz und Durchsturz; mit geeignetem Aufbau auch durchwurf- und durchbruchhemmend (DIN EN 356, z. B. P4A).
                </p>
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
              <Sparkles className="text-shiraz" size={18} />
              Nanobeschichtungen &amp; Bedampfungsverfahren auf Flachglas
            </h3>

            <p className="text-xs text-text-main/80 leading-relaxed mb-6">
              Reines Glas besitzt ein hohes Strahlungsemissionsvermögen (<InlineMath math="\varepsilon \approx 0{,}84" />), 
              wodurch rund zwei Drittel des Wärmeverlusts auf langwellige Wärmestrahlung zurückzuführen sind. 
              Durch das Aufbringen hauchdünner metallischer Funktionsschichten (typisch 10 bis 100 Nanometer) 
              wird die Wärmestrahlung wie von einem Spiegel reflektiert, während das sichtbare Sonnenlicht fast ungedämpft hindurchtritt.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Sputtern vs Pyrolyse */}
              <div className="bg-off-white p-5 rounded-xl border border-home-grau/25">
                <h4 className="text-xs font-bold text-text-main uppercase tracking-wider mb-3">
                  1. Magnetron-Sputtern (Offline-Beschichtung / Soft Coatings)
                </h4>
                <p className="text-xs text-text-main/80 leading-relaxed mb-3">
                  Das moderne Hochleistungsverfahren im Vakuum (PVD - Physical Vapour Deposition). Das fertige Floatglas wird 
                  durch eine Vakuum-Beschichtungsanlage gefahren, in der Targetmaterialien (Silber, Titan, Zinkoxid) 
                  mittels Magnetron-Plasma atomar aufgedampft werden.
                </p>
                <div className="bg-white p-3 rounded-lg border border-home-grau/20 text-xs">
                  <span className="font-bold text-shiraz block mb-1">Schichtaufbau (Silber-Multilayer):</span>
                  <p className="text-[11px] text-text-main/80">
                    Glas → Dielektrikum (Entspiegelung) → Silber-Funktionsschicht (ca. 10 nm) → Opferschicht (Blocker) → Schutzschicht.
                    Erreicht eine sehr niedrige Emissivität (<InlineMath math="\varepsilon_n \approx 0{,}01\text{ bis }0{,}04" />).
                  </p>
                </div>
                <div className="mt-3 text-[11px] text-home-grau">
                  <strong>Einschränkung:</strong> Nicht witterungsstabil – muss zwingend auf der geschützten SZR-Seite eingebaut werden.
                </div>
              </div>

              <div className="bg-off-white p-5 rounded-xl border border-home-grau/25">
                <h4 className="text-xs font-bold text-text-main uppercase tracking-wider mb-3">
                  2. Pyrolytische Beschichtung (Online-Beschichtung / Hard Coatings)
                </h4>
                <p className="text-xs text-text-main/80 leading-relaxed mb-3">
                  Erfolgt direkt im Floatglas-Zinnbad bei ca. 600 °C. Zinnchlorid oder Silane werden auf das noch weiche Glas 
                  gesprüht und verschmelzen pyrolytisch mit der Glasoberfläche zu einer extrem harten Zinnoxidschicht (SnO₂:F).
                </p>
                <div className="bg-white p-3 rounded-lg border border-home-grau/20 text-xs">
                  <span className="font-bold text-slate-800 block mb-1">Eigenschaften:</span>
                  <p className="text-[11px] text-text-main/80">
                    Mechanisch und chemisch sehr robust; kann auch auf einer Außenseite liegen. 
                    Die Emissivität ist mit <InlineMath math="\varepsilon_n \approx 0{,}15" /> jedoch deutlich schlechter als bei Sputter-Silberschichten.
                  </p>
                </div>
                <div className="mt-3 text-[11px] text-home-grau">
                  <strong>Anwendung:</strong> Selbstreinigende Gläser (TiO₂-Photokatalyse), Heizelemente, historische Fenster.
                </div>
              </div>
            </div>
          </div>

          {/* Gasfüllungen im Scheibenzwischenraum */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
            <h3 className="text-base font-bold text-text-main flex items-center gap-2 mb-4">
              <Zap className="text-shiraz" size={18} />
              Gasfüllungen im Scheibenzwischenraum (SZR) im Vergleich
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-off-white border-b border-home-grau/30 text-text-main font-bold">
                    <th className="p-3">Gasart</th>
                    <th className="p-3">Wärmeleitfähigkeit λ bei 10 °C</th>
                    <th className="p-3">Dichte ρ [kg/m³]</th>
                    <th className="p-3">Optimaler SZR-Abstand</th>
                    <th className="p-3">Erreichbarer Ug (3-IV)</th>
                    <th className="p-3">Kosten &amp; Verfügbarkeit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-home-grau/20 text-text-main/80">
                  <tr className="hover:bg-off-white/50">
                    <td className="p-3 font-bold text-slate-800">Luft (trocken)</td>
                    <td className="p-3 font-mono">0,0250 W/(mK)</td>
                    <td className="p-3 font-mono">1,24</td>
                    <td className="p-3">16 mm</td>
                    <td className="p-3 font-bold text-slate-700">~ 0,9 W/(m²K)</td>
                    <td className="p-3 text-emerald-700">Kostenlos (heute nur noch bei Billig- oder Altglas)</td>
                  </tr>
                  <tr className="hover:bg-off-white/50 bg-shiraz/5">
                    <td className="p-3 font-bold text-shiraz">Argon (Ar, 90 %) - Industriestandard</td>
                    <td className="p-3 font-mono font-bold text-shiraz">0,0170 W/(mK)</td>
                    <td className="p-3 font-mono">1,70</td>
                    <td className="p-3 font-semibold">14 – 16 mm</td>
                    <td className="p-3 font-bold text-shiraz">0,6 – 0,7 W/(m²K)</td>
                    <td className="p-3 font-bold text-emerald-800">Sehr günstig (~0,93 % in Luft), Standard bei &gt; 95 % aller Fenster</td>
                  </tr>
                  <tr className="hover:bg-off-white/50">
                    <td className="p-3 font-bold text-blue-900">Krypton (Kr, 90 %)</td>
                    <td className="p-3 font-mono font-bold text-blue-900">0,0094 W/(mK)</td>
                    <td className="p-3 font-mono">3,56</td>
                    <td className="p-3 font-semibold">10 – 12 mm</td>
                    <td className="p-3 font-bold text-blue-900">0,5 W/(m²K)</td>
                    <td className="p-3 text-amber-800">Teuer; für schmale Scheibenzwischenräume</td>
                  </tr>
                  <tr className="hover:bg-off-white/50">
                    <td className="p-3 font-bold text-purple-900">Xenon (Xe)</td>
                    <td className="p-3 font-mono font-bold text-purple-900">0,0056 W/(mK)</td>
                    <td className="p-3 font-mono">5,59</td>
                    <td className="p-3 font-semibold">6 – 8 mm</td>
                    <td className="p-3 font-bold text-purple-900">&lt; 0,4 W/(m²K)</td>
                    <td className="p-3 text-red-700">Sehr teuer; im Bauwesen kaum noch eingesetzt</td>
                  </tr>
                  <tr className="hover:bg-off-white/50 bg-amber-50/50">
                    <td className="p-3 font-bold text-amber-900">Vakuum (p &lt; 0,1 Pa)</td>
                    <td className="p-3 font-mono font-bold text-amber-900">0,0000 W/(mK) (Keine Konvektion!)</td>
                    <td className="p-3 font-mono">~ 0,00</td>
                    <td className="p-3 font-bold text-amber-900">0,2 – 0,3 mm!</td>
                    <td className="p-3 font-bold text-amber-900">0,4 – 0,7 W/(m²K)</td>
                    <td className="p-3 text-amber-900">Aufwendige Randversiegelung, Zukunftstechnologie VIG für Denkmalschutz</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-4 p-4 bg-off-white rounded-xl border border-home-grau/25 text-xs text-text-main/80 flex items-start gap-2">
              <Info size={16} className="text-shiraz shrink-0 mt-0.5" />
              <div>
                <strong>Diffusionsverlust über die Lebensdauer:</strong> 
                Nach DIN EN 1279-3 darf der jährliche Gasaustritt aus dem Randverbund höchstens <strong>1,0 % pro Jahr</strong> betragen (<InlineMath math="L_i \le 1{,}0\,\%/a" />). 
                Bei 1 %/a Verlust verbleiben nach 25–30 Jahren noch rund 75 % der Füllung; gute Randverbünde liegen deutlich darunter.
              </div>
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
                      <span className="text-home-grau text-[10px] uppercase font-bold block">Typischer Uw-Wert:</span>
                      <span className="font-bold text-shiraz text-sm">{formatDeWert(win.typicalUw)} W/(m²K)</span>
                    </div>
                    <div>
                      <span className="text-home-grau text-[10px] uppercase font-bold block">Richtpreis Element:</span>
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
                  >
                    Geometrie simulieren <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Rahmenmaterialien im Lebenszyklusvergleich */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
            <h3 className="text-base font-bold text-text-main flex items-center gap-2 mb-3">
              <Compass className="text-shiraz" size={18} />
              Ökologische &amp; Technische Lebenszyklusbetrachtung der Rahmenwerkstoffe
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
              <div className="bg-off-white p-4 rounded-xl border border-home-grau/25">
                <h4 className="font-bold text-slate-900 mb-1">Kunststoff (PVC-U)</h4>
                <p className="text-text-main/80 text-[11px] leading-relaxed">
                  Geringste Anschaffungskosten, Lebensdauer ~30 Jahre. Rezyklatanteil in Kernprofilen bis zu 60 %. 
                  Aufgrund von Stabilisatoren (Calcium/Zink statt Blei) voll recyclingfähig im Rewindo-System.
                </p>
              </div>

              <div className="bg-off-white p-4 rounded-xl border border-home-grau/25">
                <h4 className="font-bold text-slate-900 mb-1">Holz (Kiefer / Eiche)</h4>
                <p className="text-text-main/80 text-[11px] leading-relaxed">
                  Beste CO₂-Bilanz aller Werkstoffe (-15 bis -30 kg CO₂-Äq pro Fenster). 
                  Erfordert jedoch regelmäßige Anstriche alle 5–8 Jahre, um Pilzbefall und Verzug vorzubeugen.
                </p>
              </div>

              <div className="bg-off-white p-4 rounded-xl border border-home-grau/25">
                <h4 className="font-bold text-slate-900 mb-1">Holz-Aluminium</h4>
                <p className="text-text-main/80 text-[11px] leading-relaxed">
                  Höchste Lebensdauer (&gt; 45 Jahre) ohne Sanierungsanstriche. Trotz höherer Grauer Energie der Aluschale 
                  durch die lange Lebensdauer im Gebäude-LCA überaus positiv bewertet.
                </p>
              </div>

              <div className="bg-off-white p-4 rounded-xl border border-home-grau/25">
                <h4 className="font-bold text-slate-900 mb-1">Aluminium</h4>
                <p className="text-text-main/80 text-[11px] leading-relaxed">
                  Hohe Primärenergie bei Neualuminium (~14 kWh/kg). Rezyklat-Aluminium (Hydro CIRCAL mit ≥ 75 % Post-Consumer-Schrott) 
                  senkt den Carbon Footprint um über 80 % auf unter 2,3 kg CO₂/kg Alu.
                </p>
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
              <FileText className="text-shiraz" size={18} />
              Relevante Normen &amp; Prüfungen für Glas und Fenster
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-off-white p-5 rounded-xl border border-home-grau/25">
                <h4 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-1.5">
                  <ShieldCheck size={16} className="text-shiraz" />
                  1. Bemessung im Bauwesen: DIN 18008 Reihe
                </h4>
                <ul className="text-xs text-text-main/80 space-y-2 leading-relaxed">
                  <li><strong>DIN 18008-1:</strong> Begriffe, allgemeine Grundlagen und Teilsicherheitskonzept nach Eurocode.</li>
                  <li><strong>DIN 18008-2:</strong> Linienförmig gelagerte Verglasungen (Standardfenster, Fassadenriegel).</li>
                  <li><strong>DIN 18008-3:</strong> Punktförmig gelagerte Verglasungen (Punkthalter, Glasklammern).</li>
                  <li><strong>DIN 18008-4:</strong> Zusatzanforderungen an absturzsichernde Verglasungen (Pendelschlagversuch mit Doppelreifen nach DIN EN 12600).</li>
                  <li><strong>DIN 18008-5:</strong> Begehbare Verglasungen (Treppenstufen, Glasböden; mind. 3 Scheiben VSG).</li>
                </ul>
              </div>

              <div className="bg-off-white p-5 rounded-xl border border-home-grau/25">
                <h4 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-1.5">
                  <CheckCircle2 size={16} className="text-shiraz" />
                  2. Produktnormen &amp; CE-Kennzeichnung
                </h4>
                <ul className="text-xs text-text-main/80 space-y-2 leading-relaxed">
                  <li><strong>DIN EN 14351-1:</strong> Fenster und Außentüren – Produktnorm, Leistungseigenschaften (CE-Kennzeichnung, Windlast, Schlagregen).</li>
                  <li><strong>DIN EN 1279 (Teile 1–6):</strong> Glas im Bauwesen – Mehrscheiben-Isolierglas (Feuchteaufnahme, Gasaustrittsrate, Alterungsbeständigkeit).</li>
                  <li><strong>DIN EN 12150:</strong> Thermisch vorgespanntes Kalknatron-Einscheibensicherheitsglas (ESG).</li>
                  <li><strong>DIN EN ISO 12543:</strong> Verbundglas und Verbund-Sicherheitsglas (VSG).</li>
                  <li><strong>DIN EN ISO 10077:</strong> Wärmetechnisches Verhalten von Fenstern, Türen und Abschlüssen (Berechnung von Uw und Uf).</li>
                </ul>
              </div>
            </div>

            {/* Prüfmethoden Prüfstand */}
            <div className="mt-6 bg-off-white p-5 rounded-xl border border-home-grau/25">
              <h4 className="font-bold text-slate-900 text-sm mb-3">
                Zertifizierungs-Prüfungen am Fensterprüfstand (ift Rosenheim / Prüfinstitute)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="bg-white p-3.5 rounded-lg border border-home-grau/20">
                  <span className="font-bold text-slate-800 block mb-1">1. Luftdurchlässigkeit (DIN EN 1026)</span>
                  <p className="text-[11px] text-text-main/75">
                    Druckstufen bis 600 Pa. Klasse 4 ist Standard für Neubauten (höchste Dichtheit gegen Zugluft).
                  </p>
                </div>
                <div className="bg-white p-3.5 rounded-lg border border-home-grau/20">
                  <span className="font-bold text-slate-800 block mb-1">2. Schlagregendichtheit (DIN EN 1027)</span>
                  <p className="text-[11px] text-text-main/75">
                    Berieselung mit Wasser bei pulsierendem Überdruck. Klasse E900: dicht bis 900 Pa Prüfdruck (DIN EN 12208).
                  </p>
                </div>
                <div className="bg-white p-3.5 rounded-lg border border-home-grau/20">
                  <span className="font-bold text-slate-800 block mb-1">3. Einbruchhemmung (DIN EN 1627)</span>
                  <p className="text-[11px] text-text-main/75">
                    Widerstandsklassen RC 1 N bis RC 4. Prüfung statisch, dynamisch (Pendel) und manueller Werkzeugangriff (Kuhfuß).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <FormulaDerivationBox
          title="Anwendungsbeispiel: Bemessungsfestigkeit von Float, TVG und ESG"
          zielGleichung="f_{g,d} = \frac{k_{mod} \cdot k_c \cdot f_{g,k}}{\gamma_M}"
          normQuelle="DIN 18008-1 und -2 (Windlast: Float k_mod = 0,7, γ_M = 1,8, k_c = 1,8 bei linienförmiger Lagerung; vorgespanntes Glas k_mod = 1,0, k_c = 1,0, γ_M = 1,5)"
          schritte={[
            { titel: '1. Floatglas (linienförmig gelagert)', formel: 'f_{g,d} = 0{,}7 \\cdot 1{,}8 \\cdot 45 / 1{,}8 = 31{,}5\\,\\text{N/mm}^2', erklaerung: 'f_g,k = 45 N/mm², k_c = 1,8 nach DIN 18008-2 für allseitig linienförmig gelagerte Vertikalverglasungen; bei punktgestützter Lagerung k_c = 1,0 → 17,5 N/mm².' },
            { titel: '2. TVG', formel: 'f_{g,d} = 1{,}0 \\cdot 70 / 1{,}5 = 46{,}7\\,\\text{N/mm}^2', erklaerung: 'Vorgespanntes Glas: k_mod = 1,0, γ_M = 1,5.' },
            { titel: '3. ESG', formel: 'f_{g,d} = 1{,}0 \\cdot 120 / 1{,}5 = 80\\,\\text{N/mm}^2', erklaerung: 'Vorgespanntes Glas: Festigkeit kaum lastdauerabhängig.' },
          ]}
          ergebnisHinweis="ESG hat rund die 2,5-fache Bemessungsfestigkeit von linienförmig gelagertem Floatglas – bricht aber krümelig ohne Resttragfähigkeit; deshalb VSG aus TVG für Überkopf und Absturzsicherung."
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
        regelwerke={[
          { title: 'DIN EN 14351-1: Fenster und Außentüren – Produktnorm, Leistungseigenschaften' },
          { title: 'DIN EN 1279-1 bis 6: Glas im Bauwesen – Mehrscheiben-Isolierglas' },
          { title: 'DIN 18008-1 bis 5: Glas im Bauwesen – Bemessungs- und Konstruktionsregeln' },
          { title: 'DIN EN ISO 10077-1: Wärmetechnisches Verhalten von Fenstern, Türen und Abschlüssen – Berechnung des Wärmedurchgangskoeffizienten' },
          { title: 'Gebäudemodernisierungsgesetz (GModG, in Kraft seit 29.07.2026, vormals GEG): Anforderungen an den sommerlichen und winterlichen Wärmeschutz von Fenstern', url: 'https://www.gesetze-im-internet.de/geg/' }
        ]}
        literatur={[
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011',
          'Weller, B.; Härth, K.; Tasche, S.; Unnewehr, S.: Konstruktiver Glasbau. München: Edition Detail 2008',
          'Wurm, J.: Glass Structures – Design and Construction of Self-Supporting Skins. Basel: Birkhäuser 2007',
          'ift Rosenheim: Richtlinien und Fachinformationen zur Fenster- und Fassadentechnik'
        ]}
        weblinks={[
          { title: 'Bundesverband Flachglas (BF) – Technische Richtlinien', url: 'https://www.bundesverband-flachglas.de/' },
          { title: 'ift Rosenheim – Institut für Fenstertechnik', url: 'https://www.ift-rosenheim.de/' },
          { title: 'Verband Fenster + Fassade (VFF)', url: 'https://www.window.de/' }
        ]}
        formeln={[
          {
            formel: 'U_w = \\frac{A_g \\cdot U_g + A_f \\cdot U_f + l_g \\cdot \\Psi_g}{A_g + A_f}',
            erklaerung: 'Berechnung des gesamten Wärmedurchgangskoeffizienten U_w eines Fensters nach DIN EN ISO 10077-1: Zusammensetzung aus Glasfläche A_g mit U_g, Rahmenfläche A_f mit U_f und dem linearen Wärmedurchgangskoeffizienten des Glasrandes Ψ_g über den Umfang l_g.',
            quelle: 'DIN EN ISO 10077-1'
          },
          {
            formel: 'S = \\frac{\\tau_v}{g}',
            erklaerung: 'Selektivitätskennzahl S von Sonnenschutzverglasungen: Verhältnis von Lichttransmission τ_v zum Gesamtenergiedurchlassgrad g. Hochselektive Gläser erreichen Werte von S ≈ 1,8 bis 2,0 (viel Licht bei wenig Wärme).',
            quelle: 'DIN EN 410'
          },
          {
            formel: '\\sigma_{\\text{max}} = \\frac{3 \\cdot F \\cdot L}{2 \\cdot b \\cdot h^2} \\le f_{g,d} = \\frac{k_{\\text{mod}} \\cdot f_{g,k}}{\\gamma_M}',
            erklaerung: 'Nachweis der Biegezugspannung im Glas nach DIN 18008 mit charakteristischer Festigkeit f_{g,k} (Float: 45 N/mm², TVG: 70 N/mm², ESG: 120 N/mm²), Modifikationsbeiwert k_{mod} für Lasteinwirkungsdauer und Teilsicherheitsbeiwert γ_M.',
            quelle: 'DIN 18008-1'
          }
        ]}
      />
    </div>
  );
}
