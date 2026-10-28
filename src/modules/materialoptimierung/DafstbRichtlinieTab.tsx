import type { Dispatch, SetStateAction } from 'react';
import { Beaker, Layers, CheckCircle2, Calculator, BookOpen, Scale, Award, Building2, Sliders } from 'lucide-react';
import { InlineMath, BlockMath } from 'react-katex';
import { formatDeZahl, formatDeWert, formatDeIntl } from '@/src/utils/numberFormat';
import inhalt from '@/content/materialoptimierung/DafstbRichtlinieTab.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { EingabeHinweise } from '@/src/components/ui/EingabeHinweise';
import type { Hinweis } from '@/src/calc/plausibilitaet';

export interface DafstbRichtlinieTabProps {
  dafstbCalc: { label: string; areaUnit: string; refArea: number; refBetonVol: number; refStahlKg: number; optBetonVol: number; optStahlKg: number; optConcreteGwpPerM3: number; refTotalGwp: number; optTotalGwp: number; refConcreteGwpTotal: number; optConcreteGwpTotal: number; refSteelGwpTotal: number; optSteelGwpTotal: number; refSpecificGwp: number; optSpecificGwp: number; diffAbs: number; diffPct: number; efficiencyClass: string; efficiencyBadge: string; classLabel: string; classStar: string; hinweise: readonly Hinweis[]; };
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
              <Scale size={13} /><MdText text={inhalt.texte.dafstbRegelwerkGründruckRichtlinie} /></div>
            <h3 className="text-xl font-bold text-text-main flex items-center gap-2"><MdText text={inhalt.texte.dafstbRichtlinieTreibhausgasreduzierteTr} /></h3>
          </div>
          <span className="text-xs font-mono font-bold px-3 py-1 bg-slate-100 text-slate-700 rounded-lg border border-slate-200"><MdText text={inhalt.texte.deutscherAusschussFürStahlbeton} /></span>
        </div>
    
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 leading-relaxed">
          <p><MdText text={inhalt.texte.rund60Bis70} /></p>
        </div>
      </div>
    
      {/* 3-Ebenen-Systematik der DAfStb-Richtlinie */}
      <div className="bg-white border border-home-grau/30 rounded-2xl p-6 shadow-sm space-y-4">
        <h4 className="text-base font-bold text-text-main flex items-center gap-2">
          <Building2 className="text-shiraz" size={18} /><MdText text={inhalt.texte.das3EbenenNachweiskonzept} /></h4>
        <p className="text-xs text-slate-600"><MdText text={inhalt.texte.dieRichtlinieVerknüpftBaustoffherstellun} /></p>
    
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-home-grau/30 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 block mb-1">Ebene 1</span>
              <h5 className="font-bold text-sm text-text-main mb-1.5 flex items-center gap-1.5">
                <Beaker size={15} className="text-shiraz" /><MdText text={inhalt.texte.baustoffebeneBetonStahl} /></h5>
              <p className="text-xs text-slate-600 leading-relaxed mb-3"><MdText text={inhalt.texte.quantifizierungDerSpezifischenEmissionen} /></p>
            </div>
            <div className="pt-2 border-t border-slate-200/80 text-[11px] font-mono text-slate-500"><MdText text={inhalt.texte.fokusKlinkerfaktorZementartK} /></div>
          </div>
    
          <div className="p-4 rounded-xl bg-slate-50 border border-home-grau/30 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 block mb-1">Ebene 2</span>
              <h5 className="font-bold text-sm text-text-main mb-1.5 flex items-center gap-1.5">
                <Layers size={15} className="text-shiraz" /><MdText text={inhalt.texte.bauteilebeneDeckenStützenWände} /></h5>
              <p className="text-xs text-slate-600 leading-relaxed mb-3"><MdText text={inhalt.texte.zusammenführungVonBaustoffGwp} /></p>
            </div>
            <div className="pt-2 border-t border-slate-200/80 text-[11px] font-mono text-slate-500"><MdText text={inhalt.texte.fokusSchlankheitHohlkörperVorspannung} /></div>
          </div>
    
          <div className="p-4 rounded-xl bg-slate-50 border border-home-grau/30 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 block mb-1">Ebene 3</span>
              <h5 className="font-bold text-sm text-text-main mb-1.5 flex items-center gap-1.5">
                <Award size={15} className="text-shiraz" /><MdText text={inhalt.texte.gesamttragwerkGebäudeebene} /></h5>
              <p className="text-xs text-slate-600 leading-relaxed mb-3"><MdText text={inhalt.texte.summationAllerTragwerkselementeBezogen} /></p>
              <div className="bg-white p-2 rounded-lg border border-home-grau/30 text-center my-1">
                <InlineMath math="GWP_{\text{Ist}} \le GWP_{\text{Ziel}} \le GWP_{\text{Referenz}}" />
              </div>
            </div>
            <div className="pt-2 border-t border-slate-200/80 text-[11px] font-mono text-slate-500"><MdText text={inhalt.texte.fokusLastabtragStützenrasterFundamentier} /></div>
          </div>
        </div>
      </div>
    
      {/* DAfStb-Effizienzklassen Matrix */}
      <div className="bg-white border border-home-grau/30 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="border-b border-home-grau/20 pb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h4 className="text-base font-bold text-text-main flex items-center gap-2">
              <Award className="text-shiraz" size={18} /><MdText text={inhalt.texte.thgEffizienzklassenNachDafstb} /></h4>
            <p className="text-xs text-slate-600 mt-0.5"><MdText text={inhalt.texte.klassifizierungDerTreibhausgasminderungG} /></p>
          </div>
          <span className="text-[11px] font-bold px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200"><MdText text={inhalt.texte.t5Dekarbonisierungsstufen} /></span>
        </div>
    
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono font-black text-xs text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">Klasse A+</span>
                <span className="text-xs text-emerald-700">★★★★★</span>
              </div>
              <strong className="text-xs font-bold text-emerald-950 block mb-1"><MdText text={inhalt.texte.thgMinderung50} /></strong>
              <p className="text-[11px] text-slate-600 leading-snug"><MdText text={inhalt.texte.ultraLowCarbonStandard} /></p>
            </div>
            <span className="text-[10px] font-bold text-emerald-800 mt-3 pt-2 border-t border-emerald-200/60 block"><MdText text={inhalt.texte.dgnbQngPlatinLevel} /></span>
          </div>
    
          <div className="p-3.5 rounded-xl border border-green-200 bg-green-50/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono font-black text-xs text-green-900 bg-green-100 px-2 py-0.5 rounded border border-green-300">Klasse A</span>
                <span className="text-xs text-green-700">★★★★☆</span>
              </div>
              <strong className="text-xs font-bold text-green-950 block mb-1"><MdText text={inhalt.texte.thgMinderung4049} /></strong>
              <p className="text-[11px] text-slate-600 leading-snug"><MdText text={inhalt.texte.ambitioniertesZielCemIii} /></p>
            </div>
            <span className="text-[10px] font-bold text-green-800 mt-3 pt-2 border-t border-green-200/60 block"><MdText text={inhalt.texte.qngPremiumTauglich} /></span>
          </div>
    
          <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono font-black text-xs text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">Klasse B</span>
                <span className="text-xs text-amber-700">★★★☆☆</span>
              </div>
              <strong className="text-xs font-bold text-amber-950 block mb-1"><MdText text={inhalt.texte.thgMinderung2539} /></strong>
              <p className="text-[11px] text-slate-600 leading-snug"><MdText text={inhalt.texte.wirtschaftlichesOptimumCemIi} /></p>
            </div>
            <span className="text-[10px] font-bold text-amber-800 mt-3 pt-2 border-t border-amber-200/60 block"><MdText text={inhalt.texte.qngPlusStandard} /></span>
          </div>
    
          <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono font-black text-xs text-blue-900 bg-blue-100 px-2 py-0.5 rounded border border-blue-300">Klasse C</span>
                <span className="text-xs text-blue-700">★★☆☆☆</span>
              </div>
              <strong className="text-xs font-bold text-blue-950 block mb-1"><MdText text={inhalt.texte.thgMinderung1024} /></strong>
              <p className="text-[11px] text-slate-600 leading-snug"><MdText text={inhalt.texte.einstiegsstandardLeichteZementoptimierun} /></p>
            </div>
            <span className="text-[10px] font-bold text-blue-800 mt-3 pt-2 border-t border-blue-200/60 block">Basis-Verbesserung</span>
          </div>
    
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono font-black text-xs text-slate-700 bg-slate-200 px-2 py-0.5 rounded border border-slate-300">Referenz</span>
                <span className="text-xs text-slate-500">Basis</span>
              </div>
              <strong className="text-xs font-bold text-slate-900 block mb-1"><MdText text={inhalt.texte.benchmark0} /></strong>
              <p className="text-[11px] text-slate-500 leading-snug"><MdText text={inhalt.texte.historischKonventionelleBauweiseNach} /></p>
            </div>
            <span className="text-[10px] font-bold text-slate-600 mt-3 pt-2 border-t border-slate-200 block">Ausgangs-Baseline</span>
          </div>
        </div>
      </div>
    
      {/* 4 Planerische Hebel */}
      <div className="bg-white border border-home-grau/30 rounded-2xl p-6 shadow-sm space-y-4">
        <h4 className="text-base font-bold text-text-main flex items-center gap-2">
          <Sliders className="text-shiraz" size={18} /><MdText text={inhalt.texte.die4PlanerischenHebel} /></h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-home-grau/30 bg-off-white space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm text-text-main">
              <div className="w-6 h-6 rounded-md bg-shiraz text-white flex items-center justify-center text-xs font-mono font-bold">1</div>
              <span><MdText text={inhalt.texte.tragwerksgeometrieLeichtbau} /></span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Material nur dort anordnen, wo Zug- oder Druckkräfte fließen.
              <strong> Hohlkörperdecken</strong> verdrängen bis zu 35 % Beton in der statischen Nullzone ohne Traglastverlust.
              <strong><MdText text={inhalt.texte.vorspannungMitSofortigemOder} /></strong> verringert Deckendicken um 20 bis 25 % und spart tonnenweise Durchstanz- und Biegebewehrung.
              <strong><MdText text={inhalt.texte.hochfesterBetonC5060} /></strong> spart trotz zementreicherer Mischung über 50 % Querschnittsvolumen – netto sinkt der CO₂-Ausstoß der Stütze um rund 35 %!
            </p>
          </div>
    
          <div className="p-4 rounded-xl border border-home-grau/30 bg-off-white space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm text-text-main">
              <div className="w-6 h-6 rounded-md bg-shiraz text-white flex items-center justify-center text-xs font-mono font-bold">2</div>
              <span><MdText text={inhalt.texte.klinkerfaktorPrüfalter56D} /></span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Portlandzementklinker ist der Hauptemittent. Substitution durch Hüttensandmehl (CEM III/A), calcinierte Tone (LC3) oder Kalksteinmehl (CEM II/C-M) senkt den Zement-GWP um 50 bis 70 %.
              <strong><MdText text={inhalt.texte.dafstbRegelZumPrüfalter} /></strong> Wer die Konformitätsprüfung auf <strong><MdText text={inhalt.texte.t56TageStatt28} /></strong> festlegt (DIN EN 206), nutzt die langsame Puzzolan- und Hüttensandhydratation vollständig aus und kann die Zementdosierung um ca. 8 bis 10 % reduzieren.
            </p>
          </div>
    
          <div className="p-4 rounded-xl border border-home-grau/30 bg-off-white space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm text-text-main">
              <div className="w-6 h-6 rounded-md bg-shiraz text-white flex items-center justify-center text-xs font-mono font-bold">3</div>
              <span><MdText text={inhalt.texte.bewehrungsstahlHerstellroute} /></span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed"><MdText text={inhalt.texte.bewehrungsstahlEmittiertÜberDie} /></p>
          </div>
    
          <div className="p-4 rounded-xl border border-home-grau/30 bg-off-white space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm text-text-main">
              <div className="w-6 h-6 rounded-md bg-shiraz text-white flex items-center justify-center text-xs font-mono font-bold">4</div>
              <span><MdText text={inhalt.texte.bauablaufNachbehandlungDinEn} /></span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed"><MdText text={inhalt.texte.klinkerarmeBetoneErhärtenLangsamer} /></p>
          </div>
        </div>
      </div>
    
      {/* Interaktiver DAfStb-Tragwerksrechner */}
      <div className="bg-white border border-home-grau/30 rounded-2xl p-6 shadow-sm space-y-5">
        <div className="border-b border-home-grau/20 pb-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h4 className="text-base font-bold text-text-main flex items-center gap-2">
              <Calculator className="text-shiraz" size={18} /><MdText text={inhalt.texte.interaktiverDafstbBauteilrechnerVariante} /></h4>
            <p className="text-xs text-slate-600 mt-0.5"><MdText text={inhalt.texte.simulierenSieDenThg} /></p>
          </div>
          <div className={`px-3 py-1 rounded-xl border font-bold text-xs flex items-center gap-1.5 ${dafstbCalc.efficiencyBadge}`}>
            <Award size={14} /> {dafstbCalc.efficiencyClass} ({dafstbCalc.classLabel})
          </div>
        </div>
        <EingabeHinweise hinweise={dafstbCalc.hinweise} />
    
        {/* Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-home-grau/20">
          
          {/* Bauteil-Auswahl */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-700 block uppercase tracking-wider font-mono"><MdText text={inhalt.texte.t1Bauteiltyp} /></label>
            <select aria-label={inhalt.werte.t1Bauteiltyp}
              value={dafstbBauteil}
              onChange={(e) => {
                const b = e.target.value as typeof dafstbBauteil;
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
            <span className="text-[10px] text-slate-500 block"><MdText text={inhalt.texte.referenzMassivesStandardbauteil} /></span>
          </div>
    
          {/* Bauweise & Geometrie-Optimierung */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-700 block uppercase tracking-wider font-mono"><MdText text={inhalt.texte.t2GeometrieBauweise} /></label>
            <select aria-label={inhalt.werte.t2GeometrieBauweise}
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
            <span className="text-[10px] text-slate-500 block"><MdText text={inhalt.texte.gewichtsUndQuerschnittsreduktion} /></span>
          </div>
    
          {/* Bindemittel & Zementtyp */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-700 block uppercase tracking-wider font-mono"><MdText text={inhalt.texte.t3ZementBindemittelart} /></label>
            <select aria-label={inhalt.werte.t3ZementBindemittelart}
              value={dafstbZement}
              onChange={(e) => setDafstbZement(e.target.value as "cem1" | "cem2_all" | "cem2_bs" | "cem3_a" | "cem2_cm")}
              className="w-full text-xs font-bold p-2.5 rounded-lg border border-home-grau/30 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-shiraz"
            >
              <option value="cem1">CEM I (Klinker 95% - Ref. 310 kg/m³)</option>
              <option value="cem2_all">CEM II/A-LL (Kalkstein - 250 kg/m³)</option>
              <option value="cem2_bs">CEM II/B-S (Hüttensand - 190 kg/m³)</option>
              <option value="cem3_a">CEM III/A (Hochofenzement - 135 kg/m³)</option>
              <option value="cem2_cm">CEM II/C-M / LC3 (Ultra-Low - 105 kg/m³)</option>
            </select>
            <span className="text-[10px] text-slate-500 block"><MdText text={inhalt.texte.klinkerersatzNachDinEn} /></span>
          </div>
    
          {/* Prüfalter & Stahlroute */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-700 block uppercase tracking-wider font-mono"><MdText text={inhalt.texte.t4PrüfalterStahlroute} /></label>
            <div className="flex gap-2">
              <select aria-label={inhalt.werte.t4PrüfalterStahlroute}
                value={dafstbPruefalter}
                onChange={(e) => setDafstbPruefalter(Number(e.target.value) as 28 | 56)}
                className="w-1/2 text-xs font-bold p-2 rounded-lg border border-home-grau/30 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-shiraz"
              >
                <option value={28}>28 Tage (Standard)</option>
                <option value={56}>56 Tage (DAfStb -9%)</option>
              </select>
              <select aria-label="Stahlroute"
                value={dafstbStahlRoute}
                onChange={(e) => setDafstbStahlRoute(e.target.value as "standard_bof" | "gruen_eaf")}
                className="w-1/2 text-xs font-bold p-2 rounded-lg border border-home-grau/30 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-shiraz"
              >
                <option value="standard_bof">BOF-Stahl (0,98 kg)</option>
                <option value="gruen_eaf">EAF Grün (0,42 kg)</option>
              </select>
            </div>
            <span className="text-[10px] text-slate-500 block"><MdText text={inhalt.texte.nachweispfadSchrottElektroofenstahl} /></span>
          </div>
    
        </div>
    
        {/* Results Comparison Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Box 1: Absolute CO2-Bilanz */}
          <div className="p-4 rounded-xl border border-home-grau/30 bg-white space-y-3 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block font-mono"><MdText text={inhalt.texte.gesamteTreibhausgasemissionenA1A3} /></span>
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs text-slate-500 block"><MdText text={inhalt.texte.referenzCemIBof} /></span>
                <strong className="text-lg font-bold text-slate-700 line-through decoration-slate-400">
                  {formatDeIntl(dafstbCalc.refTotalGwp)} kg
                </strong>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 block">DAfStb-Optimiert:</span>
                <strong className="text-2xl font-black text-shiraz">
                  {formatDeIntl(dafstbCalc.optTotalGwp)} kg
                </strong>
              </div>
            </div>
    
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-600"><MdText text={inhalt.texte.eingespartesCoÄquivalent} /></span>
              <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                - {formatDeIntl(dafstbCalc.diffAbs)} kg CO₂-eq
              </span>
            </div>
          </div>
    
          {/* Box 2: Spezifischer Bauteil-Kennwert */}
          <div className="p-4 rounded-xl border border-home-grau/30 bg-white space-y-3 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block font-mono"><MdText text={inhalt.texte.spezifischerBauteilKennwert} /></span>
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
                ? inhalt.werte.erfülltHöchsteFördervorgabenNach
                : dafstbCalc.diffPct >= 25
                ? inhalt.werte.erfülltAnforderungenFürQng
                : inhalt.werte.basisverbesserungFürQngDgnb}
            </div>
          </div>
    
        </div>
    
        {/* Split Comparison Bars: Concrete vs. Steel */}
        <div className="p-4 rounded-xl bg-slate-50 border border-home-grau/20 space-y-3">
          <span className="text-xs font-bold text-slate-800 block"><MdText text={inhalt.texte.emissionsanteileNachBaustoffBeton} /></span>
    
          <div className="space-y-2 text-xs">
            {/* Reference bar */}
            <div>
              <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                <span>Referenz ({formatDeIntl(dafstbCalc.refTotalGwp)} kg CO₂)</span>
                <span>Beton: {formatDeIntl(dafstbCalc.refConcreteGwpTotal)} kg | Stahl: {formatDeIntl(dafstbCalc.refSteelGwpTotal)} kg</span>
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
                <span className="font-bold text-emerald-800">Optimiert ({formatDeIntl(dafstbCalc.optTotalGwp)} kg CO₂)</span>
                <span>Beton: {formatDeIntl(dafstbCalc.optConcreteGwpTotal)} kg | Stahl: {formatDeIntl(dafstbCalc.optSteelGwpTotal)} kg</span>
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
              <span><MdText text={inhalt.texte.betonOptimiert} />{formatDeWert(dafstbCalc.optConcreteGwpPerM3)} kg/m³)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-teal-500"></span>
              <span><MdText text={inhalt.texte.bewehrungsstahl} />{dafstbStahlRoute === 'gruen_eaf' ? inhalt.werte.eafGrün042 : inhalt.werte.bofStandard098})</span>
            </div>
            <div className="flex items-center gap-1.5 ml-auto font-mono">
              Betonvolumen: {formatDeZahl(dafstbCalc.optBetonVol, 1)} m³ (Ref: {formatDeZahl(dafstbCalc.refBetonVol, 1)} m³)
            </div>
          </div>
        </div>
    
        {/* Praxis- & Bemessungsempfehlungen */}
        <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/20 text-xs text-slate-700 space-y-2">
          <strong className="font-bold text-shiraz flex items-center gap-1.5">
            <CheckCircle2 size={15} /><MdText text={inhalt.texte.tragwerksplanerischeUmsetzungNachDafstb} /></strong>
          <ul className="list-disc pl-5 space-y-1 text-slate-600 leading-relaxed text-[11px]">
            <li><MdText text={inhalt.texte.leistungsphase23Entwurf} /></li>
            <li><MdText text={inhalt.texte.leistungsphase6VorbereitungVergabe} /></li>
            <li><MdText text={inhalt.texte.ausführungBauleitungEinhaltungDer} /></li>
          </ul>
        </div>
      </div>
    
      {/* Formelsammlung DAfStb */}
      <div className="bg-white border border-home-grau/30 rounded-2xl p-6 shadow-sm space-y-4">
        <h4 className="text-base font-bold text-text-main flex items-center gap-2">
          <BookOpen className="text-shiraz" size={18} /><MdText text={inhalt.texte.normativeBerechnungsformelnDerDafstb} /></h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-home-grau/20 space-y-2">
            <strong className="text-xs font-bold text-slate-900 block"><MdText text={inhalt.texte.t1TreibhausgasbilanzDesBauteils} /></strong>
            <BlockMath math="GWP_{\text{Bauteil}} = V_{\text{c}} \cdot gwp_{\text{c}} + m_{\text{s}} \cdot gwp_{\text{s}} \quad [\text{kg CO}_2\text{-eq}]" />
            <p className="text-[11px] text-slate-500 leading-relaxed"><MdText text={inhalt.texte.mitVTextC} /></p>
          </div>
    
          <div className="p-4 rounded-xl bg-slate-50 border border-home-grau/20 space-y-2">
            <strong className="text-xs font-bold text-slate-900 block"><MdText text={inhalt.texte.t2SpezifischerBauteilEmissionswert} /></strong>
            <BlockMath math="gwp_{\text{Fläche}} = \frac{GWP_{\text{Bauteil}}}{A_{\text{Bauteil}}} \quad [\text{kg CO}_2\text{-eq}/\text{m}^2]" />
            <p className="text-[11px] text-slate-500 leading-relaxed"><MdText text={inhalt.texte.bezugAufDieBauteilfläche} /></p>
          </div>
    
          <div className="p-4 rounded-xl bg-slate-50 border border-home-grau/20 space-y-2">
            <strong className="text-xs font-bold text-slate-900 block"><MdText text={inhalt.texte.t3RelativerMinderungswertDer} /></strong>
            <BlockMath math="\Delta_{\text{THG}} = \left( 1 - \frac{GWP_{\text{opt}}}{GWP_{\text{ref}}} \right) \cdot 100 \quad [\%]" />
            <p className="text-[11px] text-slate-500 leading-relaxed"><MdText text={inhalt.texte.bestimmtDieEinstufungIn} /></p>
          </div>
    
          <div className="p-4 rounded-xl bg-slate-50 border border-home-grau/20 space-y-2">
            <strong className="text-xs font-bold text-slate-900 block"><MdText text={inhalt.texte.t4ÄquivalenterWasserzementwertMit} /></strong>
            <BlockMath math="(w/z)_{\text{eq}} = \frac{w}{z + k \cdot f} \quad \text{mit } k_{\text{FA}} = 0{,}4; \: k_{\text{HS}} = 0{,}6" />
            <p className="text-[11px] text-slate-500 leading-relaxed"><MdText text={inhalt.texte.mitZZementgehaltUnd} /></p>
          </div>
        </div>
      </div>
    
    </div>
  );
}
