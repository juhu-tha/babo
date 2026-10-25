import type { Dispatch, SetStateAction } from 'react';
import { Beaker, Layers, CheckCircle2, Calculator, BookOpen, Scale, Award, Building2, Sliders } from 'lucide-react';
import { InlineMath, BlockMath } from 'react-katex';
import { formatDeZahl, formatDeWert } from '@/src/utils/numberFormat';

export interface DafstbRichtlinieTabProps {
  dafstbCalc: { label: string; areaUnit: string; refArea: number; refBetonVol: number; refStahlKg: number; optBetonVol: number; optStahlKg: number; optConcreteGwpPerM3: number; refTotalGwp: number; optTotalGwp: number; refConcreteGwpTotal: number; optConcreteGwpTotal: number; refSteelGwpTotal: number; optSteelGwpTotal: number; refSpecificGwp: number; optSpecificGwp: number; diffAbs: number; diffPct: number; efficiencyClass: string; efficiencyBadge: string; classLabel: string; classStar: string; };
  dafstbBauteil: "decke" | "stuetze" | "wand" | "bodenplatte";
  setDafstbBauteil: Dispatch<SetStateAction<"decke" | "stuetze" | "wand" | "bodenplatte">>;
  setDafstbBauweise: Dispatch<SetStateAction<string>>;
  dafstbBauweise: string;
  dafstbZement: "cem1" | "cem2_all" | "cem2_bs" | "cem3_a" | "cem2_cm";
  setDafstbZement: Dispatch<SetStateAction<"cem1" | "cem2_all" | "cem2_bs" | "cem3_a" | "cem2_cm">>;
  dafstbPruefalter: 28 | 56;
  setDafstbPruefalter: Dispatch<SetStateAction<28 | 56>>;
  dafstbStahlRoute: "standard_bof" | "gruen_eaf";
  setDafstbStahlRoute: Dispatch<SetStateAction<"standard_bof" | "gruen_eaf">>;
}

export function DafstbRichtlinieTab({ dafstbCalc, dafstbBauteil, setDafstbBauteil, setDafstbBauweise, dafstbBauweise, dafstbZement, setDafstbZement, dafstbPruefalter, setDafstbPruefalter, dafstbStahlRoute, setDafstbStahlRoute }: DafstbRichtlinieTabProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Main Overview Card */}
      <div className="bg-white border border-home-grau/30 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-home-grau/20 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-rose-50 text-shiraz border border-rose-200 text-xs font-bold uppercase tracking-wider mb-1 font-mono">
              <Scale size={13} /> DAfStb-Regelwerk • Gründruck / Richtlinie
            </div>
            <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
              DAfStb-Richtlinie: Treibhausgasreduzierte Tragwerke aus Beton, Stahlbeton oder Spannbeton
            </h3>
          </div>
          <span className="text-xs font-mono font-bold px-3 py-1 bg-slate-100 text-slate-700 rounded-lg border border-slate-200">
            Deutscher Ausschuss für Stahlbeton e.V.
          </span>
        </div>
    
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 leading-relaxed">
          <p>
            Rund <strong>60 bis 70 % der gebundenen Treibhausgasemissionen (Embodied Carbon / Modul A1–A5)</strong> eines Rohbaus entfallen auf das tragende Massivbaugerüst – vor allem auf Decken, Stützen und Wände.
            Die <strong>DAfStb-Richtlinie „Treibhausgasreduzierte Tragwerke aus Beton, Stahlbeton oder Spannbeton“</strong> schließt die Lücke zwischen der rein standsicherheitsorientierten Tragwerksplanung nach <strong>DIN EN 1992-1-1 (Eurocode 2)</strong> und den zwingenden Dekarbonisierungsanforderungen (EU-Taxonomie, EPBD 2024, QNG, DGNB).
            Sie definiert erstmals verbindliche <strong>THG-Referenzwerte, Nachweisverfahren und Effizienzklassen</strong> für Bauteile und Tragwerke über ihren Lebenszyklus.
          </p>
        </div>
      </div>
    
      {/* 3-Ebenen-Systematik der DAfStb-Richtlinie */}
      <div className="bg-white border border-home-grau/30 rounded-2xl p-6 shadow-sm space-y-4">
        <h4 className="text-base font-bold text-text-main flex items-center gap-2">
          <Building2 className="text-shiraz" size={18} /> Das 3-Ebenen-Nachweiskonzept der Richtlinie
        </h4>
        <p className="text-xs text-slate-600">
          Die Richtlinie verknüpft Baustoffherstellung, Bauteilgeometrie und Gesamttragwerk zu einer geschlossenen Bilanzkette:
        </p>
    
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-home-grau/30 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 block mb-1">Ebene 1</span>
              <h5 className="font-bold text-sm text-text-main mb-1.5 flex items-center gap-1.5">
                <Beaker size={15} className="text-shiraz" /> Baustoffebene (Beton &amp; Stahl)
              </h5>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                Quantifizierung der spezifischen Emissionen pro Kubikmeter Beton (<InlineMath math="GWP_{\text{c}}" /> in <InlineMath math="\text{kg CO}_2\text{-eq}/\text{m}^3" />) und pro Tonne Bewehrungsstahl (<InlineMath math="GWP_{\text{s}}" />) basierend auf EPDs nach DIN EN 15804+A2.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-200/80 text-[11px] font-mono text-slate-500">
              Fokus: Klinkerfaktor, Zementart, k-Wert, EAF-Stahl
            </div>
          </div>
    
          <div className="p-4 rounded-xl bg-slate-50 border border-home-grau/30 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 block mb-1">Ebene 2</span>
              <h5 className="font-bold text-sm text-text-main mb-1.5 flex items-center gap-1.5">
                <Layers size={15} className="text-shiraz" /> Bauteilebene (Decken, Stützen, Wände)
              </h5>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                Zusammenführung von Baustoff-GWP, Bauteilgeometrie und Bewehrungsgehalt. Bildung flächen- oder längenbezogener Kennwerte (<InlineMath math="\text{kg CO}_2\text{-eq}/\text{m}^2" /> bzw. <InlineMath math="\text{kg CO}_2\text{-eq}/\text{m}" />).
              </p>
            </div>
            <div className="pt-2 border-t border-slate-200/80 text-[11px] font-mono text-slate-500">
              Fokus: Schlankheit, Hohlkörper, Vorspannung, Bewehrungsgrad
            </div>
          </div>
    
          <div className="p-4 rounded-xl bg-slate-50 border border-home-grau/30 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 block mb-1">Ebene 3</span>
              <h5 className="font-bold text-sm text-text-main mb-1.5 flex items-center gap-1.5">
                <Award size={15} className="text-shiraz" /> Gesamttragwerk (Gebäudeebene)
              </h5>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                Summation aller Tragwerkselemente bezogen auf die Nettogrundfläche (NGF) des Gebäudes. Nachweisbedingung nach DAfStb:
              </p>
              <div className="bg-white p-2 rounded-lg border border-home-grau/30 text-center my-1">
                <InlineMath math="GWP_{\text{Ist}} \le GWP_{\text{Ziel}} \le GWP_{\text{Referenz}}" />
              </div>
            </div>
            <div className="pt-2 border-t border-slate-200/80 text-[11px] font-mono text-slate-500">
              Fokus: Lastabtrag, Stützenraster, Fundamentierung
            </div>
          </div>
        </div>
      </div>
    
      {/* DAfStb-Effizienzklassen Matrix */}
      <div className="bg-white border border-home-grau/30 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="border-b border-home-grau/20 pb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h4 className="text-base font-bold text-text-main flex items-center gap-2">
              <Award className="text-shiraz" size={18} /> THG-Effizienzklassen nach DAfStb
            </h4>
            <p className="text-xs text-slate-600 mt-0.5">
              Klassifizierung der Treibhausgasminderung gegenüber dem normativen Benchmark (konventioneller Standard mit CEM I)
            </p>
          </div>
          <span className="text-[11px] font-bold px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200">
            5 Dekarbonisierungsstufen
          </span>
        </div>
    
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono font-black text-xs text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">Klasse A+</span>
                <span className="text-xs text-emerald-700">★★★★★</span>
              </div>
              <strong className="text-xs font-bold text-emerald-950 block mb-1">THG-Minderung &ge; 50 %</strong>
              <p className="text-[11px] text-slate-600 leading-snug">
                Ultra-Low-Carbon Standard. Zement CEM III/B oder CEM II/C-M, 56d-Prüfalter, Hohlkörper-/Vorspanndecke, 100% Elektroofenstahl.
              </p>
            </div>
            <span className="text-[10px] font-bold text-emerald-800 mt-3 pt-2 border-t border-emerald-200/60 block">DGNB/QNG Platin-Level</span>
          </div>
    
          <div className="p-3.5 rounded-xl border border-green-200 bg-green-50/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono font-black text-xs text-green-900 bg-green-100 px-2 py-0.5 rounded border border-green-300">Klasse A</span>
                <span className="text-xs text-green-700">★★★★☆</span>
              </div>
              <strong className="text-xs font-bold text-green-950 block mb-1">THG-Minderung 40–49 %</strong>
              <p className="text-[11px] text-slate-600 leading-snug">
                Ambitioniertes Ziel. CEM III/A oder CEM II/B-S mit k-Wert, schlankere Deckenquerschnitte, optimierte Bewehrungsführung.
              </p>
            </div>
            <span className="text-[10px] font-bold text-green-800 mt-3 pt-2 border-t border-green-200/60 block">QNG-Premium tauglich</span>
          </div>
    
          <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono font-black text-xs text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">Klasse B</span>
                <span className="text-xs text-amber-700">★★★☆☆</span>
              </div>
              <strong className="text-xs font-bold text-amber-950 block mb-1">THG-Minderung 25–39 %</strong>
              <p className="text-[11px] text-slate-600 leading-snug">
                Wirtschaftliches Optimum. CEM II/A-LL / CEM II/B, moderater Klinkerersatz, konsequenter Verzicht auf Überdimensionierung.
              </p>
            </div>
            <span className="text-[10px] font-bold text-amber-800 mt-3 pt-2 border-t border-amber-200/60 block">QNG-Plus Standard</span>
          </div>
    
          <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono font-black text-xs text-blue-900 bg-blue-100 px-2 py-0.5 rounded border border-blue-300">Klasse C</span>
                <span className="text-xs text-blue-700">★★☆☆☆</span>
              </div>
              <strong className="text-xs font-bold text-blue-950 block mb-1">THG-Minderung 10–24 %</strong>
              <p className="text-[11px] text-slate-600 leading-snug">
                Einstiegsstandard. Leichte Zementoptimierung, Standardbewehrung, minimale Bauteilreduktion ohne Bauablaufanpassung.
              </p>
            </div>
            <span className="text-[10px] font-bold text-blue-800 mt-3 pt-2 border-t border-blue-200/60 block">Basis-Verbesserung</span>
          </div>
    
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono font-black text-xs text-slate-700 bg-slate-200 px-2 py-0.5 rounded border border-slate-300">Referenz</span>
                <span className="text-xs text-slate-500">Basis</span>
              </div>
              <strong className="text-xs font-bold text-slate-900 block mb-1">Benchmark (0 %)</strong>
              <p className="text-[11px] text-slate-500 leading-snug">
                Historisch-konventionelle Bauweise nach DIN EN 206 mit reinem CEM I (Klinker &ge; 95%) und BOF-Standardstahl.
              </p>
            </div>
            <span className="text-[10px] font-bold text-slate-600 mt-3 pt-2 border-t border-slate-200 block">Ausgangs-Baseline</span>
          </div>
        </div>
      </div>
    
      {/* 4 Planerische Hebel */}
      <div className="bg-white border border-home-grau/30 rounded-2xl p-6 shadow-sm space-y-4">
        <h4 className="text-base font-bold text-text-main flex items-center gap-2">
          <Sliders className="text-shiraz" size={18} /> Die 4 planerischen Hebel des Tragwerksplaners nach DAfStb
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-home-grau/30 bg-off-white space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm text-text-main">
              <div className="w-6 h-6 rounded-md bg-shiraz text-white flex items-center justify-center text-xs font-mono font-bold">1</div>
              <span>Tragwerksgeometrie &amp; Leichtbau</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Material nur dort anordnen, wo Zug- oder Druckkräfte fließen.
              <strong> Hohlkörperdecken</strong> verdrängen bis zu 35 % Beton in der statischen Nullzone ohne Traglastverlust.
              <strong> Vorspannung mit sofortigem oder nachträglichem Verbund</strong> verringert Deckendicken um 20 bis 25 % und spart tonnenweise Durchstanz- und Biegebewehrung.
              <strong> Hochfester Beton (C50/60 bis C80/95) für Stützen</strong> spart trotz zementreicherer Mischung über 50 % Querschnittsvolumen – netto sinkt der CO₂-Ausstoß der Stütze um rund 35 %!
            </p>
          </div>
    
          <div className="p-4 rounded-xl border border-home-grau/30 bg-off-white space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm text-text-main">
              <div className="w-6 h-6 rounded-md bg-shiraz text-white flex items-center justify-center text-xs font-mono font-bold">2</div>
              <span>Klinkerfaktor &amp; Prüfalter 56 d</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Portlandzementklinker ist der Hauptemittent. Substitution durch Hüttensandmehl (CEM III/A), calcinierte Tone (LC3) oder Kalksteinmehl (CEM II/C-M) senkt den Zement-GWP um 50 bis 70 %.
              <strong> DAfStb-Regel zum Prüfalter:</strong> Wer die Konformitätsprüfung auf <strong>56 Tage statt 28 Tage</strong> festlegt (DIN EN 206), nutzt die langsame Puzzolan- und Hüttensandhydratation vollständig aus und kann die Zementdosierung um ca. 8 bis 10 % reduzieren.
            </p>
          </div>
    
          <div className="p-4 rounded-xl border border-home-grau/30 bg-off-white space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm text-text-main">
              <div className="w-6 h-6 rounded-md bg-shiraz text-white flex items-center justify-center text-xs font-mono font-bold">3</div>
              <span>Bewehrungsstahl &amp; Herstellroute</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Bewehrungsstahl emittiert über die Hochofenroute (BOF) rund <strong>0,95 bis 1,2 kg CO₂-eq/kg</strong>, über die Elektrolichtbogenroute (EAF / 100% Stahlschrott mit Grünstrom) nur <strong>0,35 bis 0,45 kg CO₂-eq/kg</strong> – eine Reduktion um fast 60 %!
              Zusätzlich lässt sich die Zwangsbewehrung zur Rissbreitenbegrenzung (<InlineMath math="w_{\text{max}}" />) durch den Einsatz von Zementen mit geringer Hydratationswärme (LH-Zemente) und optimierte Nachbehandlung drastisch reduzieren.
            </p>
          </div>
    
          <div className="p-4 rounded-xl border border-home-grau/30 bg-off-white space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm text-text-main">
              <div className="w-6 h-6 rounded-md bg-shiraz text-white flex items-center justify-center text-xs font-mono font-bold">4</div>
              <span>Bauablauf &amp; Nachbehandlung (DIN EN 13670)</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Klinkerarme Betone erhärten langsamer und besitzen in den ersten Tagen eine empfindlichere Randzone.
              Die DAfStb-Richtlinie fordert daher eine <strong>angepasste Nachbehandlung (Nachbehandlungsklasse 3 oder 4 nach DIN EN 13670 / DIN 1045-3)</strong>: längeres Belassen der Schalung, Feuchthalten oder Nachbehandlungsfilme verhindern das vorzeitige Austrocknen und garantieren eine dichte, karbonatisierungsresistente Betondeckung.
            </p>
          </div>
        </div>
      </div>
    
      {/* Interaktiver DAfStb-Tragwerksrechner */}
      <div className="bg-white border border-home-grau/30 rounded-2xl p-6 shadow-sm space-y-5">
        <div className="border-b border-home-grau/20 pb-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h4 className="text-base font-bold text-text-main flex items-center gap-2">
              <Calculator className="text-shiraz" size={18} /> Interaktiver DAfStb-Bauteilrechner &amp; Variantenvergleich
            </h4>
            <p className="text-xs text-slate-600 mt-0.5">
              Simulieren Sie den THG-Unterschied zwischen konventionellem Tragwerks-Benchmark und DAfStb-optimierter Bauweise.
            </p>
          </div>
          <div className={`px-3 py-1 rounded-xl border font-bold text-xs flex items-center gap-1.5 ${dafstbCalc.efficiencyBadge}`}>
            <Award size={14} /> {dafstbCalc.efficiencyClass} ({dafstbCalc.classLabel})
          </div>
        </div>
    
        {/* Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-home-grau/20">
          
          {/* Bauteil-Auswahl */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-700 block uppercase tracking-wider font-mono">
              1. Bauteiltyp
            </label>
            <select aria-label="1. Bauteiltyp"
              value={dafstbBauteil}
              onChange={(e) => {
                const b = e.target.value as any;
                setDafstbBauteil(b);
                if (b === 'decke') setDafstbBauweise('hohlkoerper');
                else if (b === 'stuetze') setDafstbBauweise('hochfest_c50_schlank');
                else if (b === 'wand') setDafstbBauweise('optimiert_18');
                else if (b === 'bodenplatte') setDafstbBauweise('optimiert_28');
              }}
              className="w-full text-xs font-bold p-2.5 rounded-lg border border-home-grau/30 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-shiraz"
            >
              <option value="decke">Geschossdecke (100 m²)</option>
              <option value="stuetze">Stützen (4 Stk. à 3,50 m = 14 m)</option>
              <option value="wand">Tragwand / Kernwand (60 m²)</option>
              <option value="bodenplatte">Fundamentplatte (120 m²)</option>
            </select>
            <span className="text-[10px] text-slate-500 block">Referenz: massives Standardbauteil</span>
          </div>
    
          {/* Bauweise & Geometrie-Optimierung */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-700 block uppercase tracking-wider font-mono">
              2. Geometrie &amp; Bauweise
            </label>
            <select aria-label="2. Geometrie &amp; Bauweise"
              value={dafstbBauweise}
              onChange={(e) => setDafstbBauweise(e.target.value)}
              className="w-full text-xs font-bold p-2.5 rounded-lg border border-home-grau/30 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-shiraz"
            >
              {dafstbBauteil === 'decke' && (
                <>
                  <option value="massiv">Massivplatte schlank (24 cm)</option>
                  <option value="hohlkoerper">Hohlkörperdecke (26 cm, -25% Beton)</option>
                  <option value="vorgespannt">Vorgespannte Flachdecke (20 cm, -51% Bewehrung)</option>
                </>
              )}
              {dafstbBauteil === 'stuetze' && (
                <>
                  <option value="standard_c25">Standard C25/30 (45 x 45 cm)</option>
                  <option value="hochfest_c50_schlank">Hochfest C50/60 schlank (30 x 30 cm, -55% Beton)</option>
                </>
              )}
              {dafstbBauteil === 'wand' && (
                <>
                  <option value="standard_24">Standardwand massiv (24 cm)</option>
                  <option value="optimiert_18">Optimierte Tragwand (18 cm, -25% Beton)</option>
                </>
              )}
              {dafstbBauteil === 'bodenplatte' && (
                <>
                  <option value="standard_35">Standard-Bodenplatte (35 cm)</option>
                  <option value="optimiert_28">Dickenreduziert (28 cm, -20% Beton)</option>
                </>
              )}
            </select>
            <span className="text-[10px] text-slate-500 block">Gewichts- und Querschnittsreduktion</span>
          </div>
    
          {/* Bindemittel & Zementtyp */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-700 block uppercase tracking-wider font-mono">
              3. Zement- &amp; Bindemittelart
            </label>
            <select aria-label="3. Zement- &amp; Bindemittelart"
              value={dafstbZement}
              onChange={(e) => setDafstbZement(e.target.value as any)}
              className="w-full text-xs font-bold p-2.5 rounded-lg border border-home-grau/30 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-shiraz"
            >
              <option value="cem1">CEM I (Klinker 95% - Ref. 310 kg/m³)</option>
              <option value="cem2_all">CEM II/A-LL (Kalkstein - 250 kg/m³)</option>
              <option value="cem2_bs">CEM II/B-S (Hüttensand - 190 kg/m³)</option>
              <option value="cem3_a">CEM III/A (Hochofenzement - 135 kg/m³)</option>
              <option value="cem2_cm">CEM II/C-M / LC3 (Ultra-Low - 105 kg/m³)</option>
            </select>
            <span className="text-[10px] text-slate-500 block">Klinkerersatz nach DIN EN 197-1/-5</span>
          </div>
    
          {/* Prüfalter & Stahlroute */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-700 block uppercase tracking-wider font-mono">
              4. Prüfalter &amp; Stahlroute
            </label>
            <div className="flex gap-2">
              <select aria-label="4. Prüfalter &amp; Stahlroute"
                value={dafstbPruefalter}
                onChange={(e) => setDafstbPruefalter(Number(e.target.value) as any)}
                className="w-1/2 text-xs font-bold p-2 rounded-lg border border-home-grau/30 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-shiraz"
              >
                <option value={28}>28 Tage (Standard)</option>
                <option value={56}>56 Tage (DAfStb -9%)</option>
              </select>
              <select
                value={dafstbStahlRoute}
                onChange={(e) => setDafstbStahlRoute(e.target.value as any)}
                className="w-1/2 text-xs font-bold p-2 rounded-lg border border-home-grau/30 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-shiraz"
              >
                <option value="standard_bof">BOF-Stahl (0,98 kg)</option>
                <option value="gruen_eaf">EAF Grün (0,42 kg)</option>
              </select>
            </div>
            <span className="text-[10px] text-slate-500 block">Nachweispfad &amp; Schrott-Elektroofenstahl</span>
          </div>
    
        </div>
    
        {/* Results Comparison Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Box 1: Absolute CO2-Bilanz */}
          <div className="p-4 rounded-xl border border-home-grau/30 bg-white space-y-3 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block font-mono">
              Gesamte Treibhausgasemissionen (A1–A3)
            </span>
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs text-slate-500 block">Referenz (CEM I + BOF):</span>
                <strong className="text-lg font-bold text-slate-700 line-through decoration-slate-400">
                  {dafstbCalc.refTotalGwp.toLocaleString('de-DE')} kg
                </strong>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 block">DAfStb-Optimiert:</span>
                <strong className="text-2xl font-black text-shiraz">
                  {dafstbCalc.optTotalGwp.toLocaleString('de-DE')} kg
                </strong>
              </div>
            </div>
    
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-600">Eingespartes CO₂-Äquivalent:</span>
              <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                - {dafstbCalc.diffAbs.toLocaleString('de-DE')} kg CO₂-eq
              </span>
            </div>
          </div>
    
          {/* Box 2: Spezifischer Bauteil-Kennwert */}
          <div className="p-4 rounded-xl border border-home-grau/30 bg-white space-y-3 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block font-mono">
              Spezifischer Bauteil-Kennwert
            </span>
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs text-slate-500 block">Referenz:</span>
                <strong className="text-base font-bold text-slate-600">
                  {formatDeZahl(dafstbCalc.refSpecificGwp, 1)} kg / {dafstbCalc.areaUnit}
                </strong>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 block">Optimiert:</span>
                <strong className="text-2xl font-black text-emerald-700">
                  {formatDeZahl(dafstbCalc.optSpecificGwp, 1)} kg
                </strong>
                <span className="text-[10px] text-slate-500 block">pro {dafstbCalc.areaUnit}</span>
              </div>
            </div>
    
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-600">THG-Reduktionsgrad:</span>
              <span className="font-extrabold text-emerald-700 text-sm">
                {formatDeZahl(dafstbCalc.diffPct, 1)} % Minderung
              </span>
            </div>
          </div>
    
          {/* Box 3: DAfStb Effizienzklasse */}
          <div className="p-4 rounded-xl border border-home-grau/30 bg-white space-y-3 shadow-2xs flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block font-mono">
                DAfStb-Einstufung
              </span>
              <div className="flex items-center justify-between mt-1">
                <strong className="text-2xl font-black text-text-main">
                  {dafstbCalc.efficiencyClass}
                </strong>
                <span className="text-amber-500 text-sm font-bold">{dafstbCalc.classStar}</span>
              </div>
              <span className="text-xs font-bold text-slate-600 block mt-0.5">
                {dafstbCalc.classLabel}
              </span>
            </div>
    
            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
              {dafstbCalc.diffPct >= 40 
                ? '✓ Erfüllt höchste Fördervorgaben nach QNG-Premium und DGNB-Kriterium ENV 1.1.'
                : dafstbCalc.diffPct >= 25
                ? '✓ Erfüllt Anforderungen für QNG-Plus und ambitionierte Nachhaltigkeitskriterien.'
                : 'Basisverbesserung. Für QNG/DGNB-Zertifizierung wird Klasse B oder A empfohlen.'}
            </div>
          </div>
    
        </div>
    
        {/* Split Comparison Bars: Concrete vs. Steel */}
        <div className="p-4 rounded-xl bg-slate-50 border border-home-grau/20 space-y-3">
          <span className="text-xs font-bold text-slate-800 block">
            Emissionsanteile nach Baustoff (Beton vs. Bewehrungsstahl)
          </span>
    
          <div className="space-y-2 text-xs">
            {/* Reference bar */}
            <div>
              <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                <span>Referenz ({dafstbCalc.refTotalGwp.toLocaleString('de-DE')} kg CO₂)</span>
                <span>Beton: {dafstbCalc.refConcreteGwpTotal.toLocaleString('de-DE')} kg | Stahl: {dafstbCalc.refSteelGwpTotal.toLocaleString('de-DE')} kg</span>
              </div>
              <div className="h-4 w-full rounded-md bg-slate-200 overflow-hidden flex">
                <div 
                  className="bg-slate-500 h-full transition-all"
                  style={{ width: `${(dafstbCalc.refConcreteGwpTotal / dafstbCalc.refTotalGwp) * 100}%` }}
                  title={`Beton CEM I: ${formatDeWert(Math.round((dafstbCalc.refConcreteGwpTotal / dafstbCalc.refTotalGwp) * 100))}%`}
                />
                <div 
                  className="bg-rose-400 h-full transition-all"
                  style={{ width: `${(dafstbCalc.refSteelGwpTotal / dafstbCalc.refTotalGwp) * 100}%` }}
                  title={`Bewehrungsstahl BOF: ${formatDeWert(Math.round((dafstbCalc.refSteelGwpTotal / dafstbCalc.refTotalGwp) * 100))}%`}
                />
              </div>
            </div>
    
            {/* Optimized bar */}
            <div>
              <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                <span className="font-bold text-emerald-800">Optimiert ({dafstbCalc.optTotalGwp.toLocaleString('de-DE')} kg CO₂)</span>
                <span>Beton: {dafstbCalc.optConcreteGwpTotal.toLocaleString('de-DE')} kg | Stahl: {dafstbCalc.optSteelGwpTotal.toLocaleString('de-DE')} kg</span>
              </div>
              <div className="h-4 w-full rounded-md bg-slate-200 overflow-hidden flex">
                <div 
                  className="bg-emerald-600 h-full transition-all"
                  style={{ width: `${(dafstbCalc.optConcreteGwpTotal / dafstbCalc.refTotalGwp) * 100}%` }}
                  title={`Beton optimiert: ${formatDeWert(dafstbCalc.optConcreteGwpTotal)} kg`}
                />
                <div 
                  className="bg-teal-500 h-full transition-all"
                  style={{ width: `${(dafstbCalc.optSteelGwpTotal / dafstbCalc.refTotalGwp) * 100}%` }}
                  title={`Bewehrungsstahl optimiert: ${formatDeWert(dafstbCalc.optSteelGwpTotal)} kg`}
                />
              </div>
            </div>
          </div>
    
          <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 pt-2 border-t border-slate-200/60">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-emerald-600"></span>
              <span>Beton optimiert ({formatDeWert(dafstbCalc.optConcreteGwpPerM3)} kg/m³)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-teal-500"></span>
              <span>Bewehrungsstahl ({dafstbStahlRoute === 'gruen_eaf' ? 'EAF Grün 0,42 kg/kg' : 'BOF Standard 0,98 kg/kg'})</span>
            </div>
            <div className="flex items-center gap-1.5 ml-auto font-mono">
              Betonvolumen: {formatDeZahl(dafstbCalc.optBetonVol, 1)} m³ (Ref: {formatDeZahl(dafstbCalc.refBetonVol, 1)} m³)
            </div>
          </div>
        </div>
    
        {/* Praxis- & Bemessungsempfehlungen */}
        <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/20 text-xs text-slate-700 space-y-2">
          <strong className="font-bold text-shiraz flex items-center gap-1.5">
            <CheckCircle2 size={15} /> Tragwerksplanerische Umsetzung nach DAfStb in der Praxis:
          </strong>
          <ul className="list-disc pl-5 space-y-1 text-slate-600 leading-relaxed text-[11px]">
            <li>
              <strong>Leistungsphase 2 &amp; 3 (Entwurf):</strong> Festlegung des Zielwertes <InlineMath math="GWP_{\text{Ziel}}" /> in der Tragwerksausschreibung und Wahl des Tragsystems (Hohlkörper, Vorspannung oder hochfeste Querschnitte).
            </li>
            <li>
              <strong>Leistungsphase 6 (Vorbereitung Vergabe):</strong> Formulierung der Betonbestellung nach DIN EN 206 / DIN 1045-2 unter Nennung von <InlineMath math="\text{CEM III/A}" /> bzw. <InlineMath math="\text{CEM II/C-M}" /> sowie <strong>Prüfalter 56 Tage</strong> für den statischen Festigkeitsnachweis.
            </li>
            <li>
              <strong>Ausführung &amp; Bauleitung:</strong> Einhaltung der verlängerten Ausschalfristen und Überwachung der Nachbehandlungsdauer nach DIN EN 13670 (Nachbehandlungsklasse 3 oder 4) zum dauerhaften Schutz der Betondeckung vor Frühkarbonatisierung.
            </li>
          </ul>
        </div>
      </div>
    
      {/* Formelsammlung DAfStb */}
      <div className="bg-white border border-home-grau/30 rounded-2xl p-6 shadow-sm space-y-4">
        <h4 className="text-base font-bold text-text-main flex items-center gap-2">
          <BookOpen className="text-shiraz" size={18} /> Normative Berechnungsformeln der DAfStb-Richtlinie
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-home-grau/20 space-y-2">
            <strong className="text-xs font-bold text-slate-900 block">
              1. Treibhausgasbilanz des Bauteils (Modul A1–A3)
            </strong>
            <BlockMath math="GWP_{\text{Bauteil}} = V_{\text{c}} \cdot gwp_{\text{c}} + m_{\text{s}} \cdot gwp_{\text{s}} \quad [\text{kg CO}_2\text{-eq}]" />
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Mit <InlineMath math="V_{\text{c}}" /> als Betonvolumen in <InlineMath math="\text{m}^3" />, <InlineMath math="gwp_{\text{c}}" /> als spezifischem Beton-GWP in <InlineMath math="\text{kg CO}_2\text{-eq}/\text{m}^3" />, <InlineMath math="m_{\text{s}}" /> als Bewehrungsmasse in <InlineMath math="\text{kg}" /> und <InlineMath math="gwp_{\text{s}}" /> als Stahl-GWP in <InlineMath math="\text{kg CO}_2\text{-eq}/\text{kg}" />.
            </p>
          </div>
    
          <div className="p-4 rounded-xl bg-slate-50 border border-home-grau/20 space-y-2">
            <strong className="text-xs font-bold text-slate-900 block">
              2. Spezifischer Bauteil-Emissionswert
            </strong>
            <BlockMath math="gwp_{\text{Fläche}} = \frac{GWP_{\text{Bauteil}}}{A_{\text{Bauteil}}} \quad [\text{kg CO}_2\text{-eq}/\text{m}^2]" />
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Bezug auf die Bauteilfläche <InlineMath math="A_{\text{Bauteil}}" /> (Decken, Wände, Bodenplatten) oder Bauteillänge <InlineMath math="L" /> (Stützen, Unterzüge) zur normativen Prüfung gegen die DAfStb-Referenzwerte.
            </p>
          </div>
    
          <div className="p-4 rounded-xl bg-slate-50 border border-home-grau/20 space-y-2">
            <strong className="text-xs font-bold text-slate-900 block">
              3. Relativer Minderungswert der Effizienzklasse
            </strong>
            <BlockMath math="\Delta_{\text{THG}} = \left( 1 - \frac{GWP_{\text{opt}}}{GWP_{\text{ref}}} \right) \cdot 100 \quad [\%]" />
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Bestimmt die Einstufung in die DAfStb-Effizienzklassen A+ (&ge; 50%), A (40–49%), B (25–39%), C (10–24%) gegenüber dem Referenztragwerk.
            </p>
          </div>
    
          <div className="p-4 rounded-xl bg-slate-50 border border-home-grau/20 space-y-2">
            <strong className="text-xs font-bold text-slate-900 block">
              4. Äquivalenter Wasserzementwert mit k-Wert (DIN 1045-2)
            </strong>
            <BlockMath math="(w/z)_{\text{eq}} = \frac{w}{z + k \cdot f} \quad \text{mit } k_{\text{FA}} = 0{,}4; \: k_{\text{HS}} = 0{,}6" />
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Mit z = Zementgehalt und f = Gehalt des anrechenbaren Zusatzstoffs (jeweils kg/m³). Erlaubt die normative Anrechnung von Flugasche (FA) und Hüttensandmehl (HS) als zementersetzende Zusatzstoffe Typ II zur Klinkerreduktion.
            </p>
          </div>
        </div>
      </div>
    
    </div>
  );
}
