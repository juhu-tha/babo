import React from 'react';
import { 
  BookOpen, 
  Layers, 
  Droplets, 
  TrendingUp, 
  ShieldAlert, 
  Calculator,
  CheckCircle2,
  FileText,
  ArrowRight,
  Sliders,
  Info
} from 'lucide-react';
import { useTabContext } from '@/src/contexts/TabContext';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaText } from '@/src/components/ui/FormulaText';
import inhalt from '@/content/betonaz/BetonAZ.json';
import { MdText } from '@/src/components/inhalt/MdText';

export default function BetonAZ() {
  const { setActiveTab } = useTabContext();

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in text-slate-800">
      
      {/* --- Unified Header: Clean Cockpit Theme --- */}
      <div className="bg-white border border-home-grau/30 rounded-2xl p-6 shadow-sm flex flex-col gap-6">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <BookOpen className="text-shiraz" /> Beton A–Z
        </h2>

        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.zentralesIngenieurtechnischesNachschlage} /></p>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-2 border-t border-home-grau/20">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-home-grau/30 text-slate-700 text-xs font-semibold tracking-wide"><MdText text={inhalt.texte.dinEn206Din} /></div>
          <div className="bg-slate-50 border border-home-grau/30 px-4 py-2.5 rounded-lg text-xs font-mono text-slate-600 flex gap-4 items-center shrink-0">
            <span><MdText text={inhalt.texte.systemStandardReferenz} /></span>
            <span><MdText text={inhalt.texte.statusNormgrundlageDinEn} /></span>
          </div>
        </div>
      </div>

      {/* --- Pillars Grid of Beton A-Z --- */}
      <div className="grid grid-cols-1 gap-6">
        
        {/* Pillar 1: Mischungsberechnung */}
        <div className="bg-white border border-home-grau/30 rounded-xl p-6 shadow-sm flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-home-grau/30 pb-3">
            <div className="flex items-center gap-2">
              <Calculator className="text-shiraz" size={22} />
              <h2 className="text-base font-bold text-slate-950 font-sans"><MdText text={inhalt.texte.t1StoffraumrechnungMischungsberechnung} /></h2>
            </div>
            <button 
              onClick={() => setActiveTab('mischungsberechnung')}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-shiraz hover:bg-shiraz/90 text-white rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
            ><MdText text={inhalt.texte.mischungsrechnerÖffnen} /><ArrowRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 flex flex-col gap-3">
              <p className="text-xs text-slate-600 leading-relaxed font-sans"><MdText text={inhalt.texte.grundlageJederBetonrezepturIst} /></p>

              <div className="p-3.5 bg-slate-50 border border-home-grau/30 rounded-lg text-xs font-sans space-y-2">
                <span className="font-bold text-slate-800"><MdText text={inhalt.texte.dieFundamentaleStoffraumgleichung} /></span>
                <div className="font-mono text-[13px] text-slate-900 border-l-2 border-shiraz/45 pl-3 py-1">
                  <FormulaText text="V_z + V_f + V_w + V_L + V_g = 1000 \, \text{dm}^3" />
                </div>
                <div className="text-[10px] text-slate-500 font-mono grid grid-cols-3 gap-1">
                  <span><MdText text={inhalt.texte.vZMZ} /></span>
                  <span><MdText text={inhalt.texte.vFMF} /></span>
                  <span><MdText text={inhalt.texte.vWMW} /></span>
                  <span><MdText text={inhalt.texte.vLLuftporenvolumen} /></span>
                  <span><MdText text={inhalt.texte.vGMG} /></span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-slate-50 p-4 rounded-xl border border-home-grau/30 flex flex-col justify-between font-sans">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block"><MdText text={inhalt.texte.standardwerteDerKomponenten} /></span>
                <table className="min-w-full text-left text-[11px] text-slate-700 mt-2 break-normal">
                  <thead>
                    <tr className="border-b border-home-grau/30 text-[9px] text-slate-400 font-bold uppercase">
                      <th className="pb-1.5">Material</th>
                      <th className="pb-1.5"><MdText text={inhalt.texte.typischerGehalt} /></th>
                      <th className="pb-1.5">Rohdichte</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr>
                      <td className="py-1 px-0 font-medium">Zement</td>
                      <td className="py-1 px-0"><MdText text={inhalt.texte.t280360KgM} /></td>
                      <td className="py-1 px-0 font-mono"><MdText text={inhalt.texte.t300315} /></td>
                    </tr>
                    <tr>
                      <td className="py-1 px-0 font-medium">Flugasche</td>
                      <td className="py-1 px-0"><MdText text={inhalt.texte.t0150KgM} /></td>
                      <td className="py-1 px-0 font-mono"><MdText text={inhalt.texte.t210230} /></td>
                    </tr>
                    <tr>
                      <td className="py-1 px-0 font-medium">Wasser</td>
                      <td className="py-1 px-0"><MdText text={inhalt.texte.t140190KgM} /></td>
                      <td className="py-1 px-0 font-mono">1,00 kg/dm³</td>
                    </tr>
                    <tr>
                      <td className="py-1 px-0 font-medium">Gestein</td>
                      <td className="py-1 px-0"><MdText text={inhalt.texte.t17001950KgM} /></td>
                      <td className="py-1 px-0 font-mono"><MdText text={inhalt.texte.t260270} /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-4 pt-3.5 border-t border-home-grau/30">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block font-sans">Zusatzstoffanrechnung:</span>
                <span className="text-[11px] text-slate-600 block mt-1"><MdText text={inhalt.texte.derÄquivalenteWasserzementwertGilt} /><FormulaText text="(w/z)_{eq} = M_w / (M_z + k \cdot M_f)" /><MdText text={inhalt.texte.flugascheBeiwert} /><span className="font-mono">k = 0,4</span>).
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Pillar 2: Gefüge & w/z-Wert */}
        <div className="bg-white border border-home-grau/30 rounded-xl p-6 shadow-sm flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-home-grau/30 pb-3">
            <div className="flex items-center gap-2">
              <Sliders className="text-shiraz" size={22} />
              <h2 className="text-base font-bold text-slate-950 font-sans"><MdText text={inhalt.texte.t2GefügekapillaritätWasserzementwertEinfl} /></h2>
            </div>
            <button 
              onClick={() => setActiveTab('festbeton')}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-shiraz hover:bg-shiraz/90 text-white rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
            ><MdText text={inhalt.texte.kapillaranalyseImFestbetonModul} /><ArrowRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 flex flex-col gap-3">
              <p className="text-xs text-slate-600 leading-relaxed font-sans"><MdText text={inhalt.texte.einesDerWichtigstenKriterien} /></p>

              <div className="p-3 bg-red-50/45 border border-red-150 rounded-lg text-xs flex gap-2 text-red-950">
                <Info size={16} className="text-red-700 shrink-0 mt-0.5" />
                <p className="font-sans leading-relaxed text-[11px]"><MdText text={inhalt.texte.dichtheitsgrenzeWZ0} /></p>
              </div>
            </div>

            <div className="lg:col-span-5 bg-slate-50 p-4 rounded-xl border border-home-grau/30 space-y-3">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block"><MdText text={inhalt.texte.gefügekennwerteNachWZ} /></span>
              <div className="space-y-2">
                <div className="bg-white p-2.5 rounded border border-home-grau/30 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-semibold block text-slate-900"><MdText text={inhalt.texte.wZ040} /></span>
                    <span className="text-[10px] text-slate-500"><MdText text={inhalt.texte.extremDichtesGefüge} /></span>
                  </div>
                  <span className="font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.5 rounded font-bold text-[10px]"><MdText text={inhalt.texte.t3Kapillarporen} /></span>
                </div>

                <div className="bg-white p-2.5 rounded border border-home-grau/30 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-semibold block text-slate-900"><MdText text={inhalt.texte.wZ045} /></span>
                    <span className="text-[10px] text-slate-500"><MdText text={inhalt.texte.klassischerXc3Xc4Außenbauteil} /></span>
                  </div>
                  <span className="font-mono bg-slate-50 text-slate-700 border border-home-grau/30 px-1.5 py-0.5 rounded font-bold text-[10px]"><MdText text={inhalt.texte.t412Kapillarporen} /></span>
                </div>

                <div className="bg-white p-2.5 rounded border border-home-grau/30 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-semibold block text-slate-950"><MdText text={inhalt.texte.wZ060} /></span>
                    <span className="text-[10px] text-slate-500"><MdText text={inhalt.texte.unbewehrterFundamentbetonSauberkeitsschi} /></span>
                  </div>
                  <span className="font-mono bg-red-50 text-red-800 border border-red-200 px-1.5 py-0.5 rounded font-bold text-[10px]"><MdText text={inhalt.texte.t25Kapillarporen} /></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pillar 3: Frischbetonkonsistenzen */}
        <div className="bg-white border border-home-grau/30 rounded-xl p-6 shadow-sm flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-home-grau/30 pb-3">
            <div className="flex items-center gap-2">
              <Droplets className="text-shiraz" size={22} />
              <h2 className="text-base font-bold text-slate-950 font-sans"><MdText text={inhalt.texte.t3FrischbetonEinbauKonsistenzklassen} /></h2>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setActiveTab('frischbeton')}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-shiraz hover:bg-shiraz/90 text-white rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                Frischbeton-Modul <ArrowRight size={14} />
              </button>
              <button 
                onClick={() => setActiveTab('herstellung_einbau')}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 border border-home-grau/30 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
              ><MdText text={inhalt.texte.herstellungEinbau} /><ArrowRight size={14} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 flex flex-col gap-3">
              <p className="text-xs text-slate-600 leading-relaxed font-sans"><MdText text={inhalt.texte.vorDerFestigkeitsausprägungMuss} /></p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-sans">
                <div className="bg-slate-50 border border-home-grau/30 p-2.5 rounded">
                  <span className="text-[10px] font-semibold text-slate-500 font-mono block"><MdText text={inhalt.texte.aTransporteLieferschein} /></span>
                  <p className="text-slate-800 font-semibold mt-0.5">Lieferscheinkontrolle</p>
                  <p className="text-slate-500 text-[10px] leading-relaxed"><MdText text={inhalt.texte.systematischerAbgleichVonLieferschein} /></p>
                </div>
                <div className="bg-slate-50 border border-home-grau/30 p-2.5 rounded">
                  <span className="text-[10px] font-semibold text-slate-500 font-mono block"><MdText text={inhalt.texte.bTransporthöheEinbau} /></span>
                  <p className="text-slate-800 font-semibold mt-0.5"><MdText text={inhalt.texte.vermeidungVonEntmischung} /></p>
                  <p className="text-slate-500 text-[10px] leading-relaxed"><MdText text={inhalt.texte.freieFallhöhenÜber1} /></p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-slate-50 p-4 rounded-xl border border-home-grau/30">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2"><MdText text={inhalt.texte.ausbreitmaßklassenKonsistenzNachDin} /></span>
              <table className="min-w-full text-left text-[11px] text-slate-700">
                <thead>
                  <tr className="border-b border-home-grau/30 text-[9px] text-slate-400 font-bold uppercase">
                    <th className="pb-1">Klasse</th>
                    <th className="pb-1">Ausbreitmaß</th>
                    <th className="pb-1"><MdText text={inhalt.texte.verhaltenTypischerEinsatz} /></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="py-1 font-mono font-bold">F1</td>
                    <td className="py-1">≤ 340 mm</td>
                    <td className="py-1 text-slate-500"><MdText text={inhalt.texte.steifMassigePfeilerDicke} /></td>
                  </tr>
                  <tr>
                    <td className="py-1 font-mono font-bold">F2</td>
                    <td className="py-1">350 - 410 mm</td>
                    <td className="py-1 text-slate-500"><MdText text={inhalt.texte.plastischGründungen} /></td>
                  </tr>
                  <tr>
                    <td className="py-1 font-mono font-bold text-shiraz">F3</td>
                    <td className="py-1">420 - 480 mm</td>
                    <td className="py-1 text-slate-600"><MdText text={inhalt.texte.weichKlassischerHochbauWände} /></td>
                  </tr>
                  <tr>
                    <td className="py-1 font-mono font-bold">F4</td>
                    <td className="py-1">490 - 550 mm</td>
                    <td className="py-1 text-slate-500"><MdText text={inhalt.texte.sehrWeichSchlankeStützen} /></td>
                  </tr>
                  <tr>
                    <td className="py-1 font-mono font-bold">F5 / F6</td>
                    <td className="py-1">≥ 560 mm</td>
                    <td className="py-1 text-slate-500"><MdText text={inhalt.texte.fließfähigSelbstverdichtenderBetonSvb} /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Pillar 4: Festbeton & Erhärtungskinetik */}
        <div className="bg-white border border-home-grau/30 rounded-xl p-6 shadow-sm flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-home-grau/30 pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="text-shiraz" size={22} />
              <h2 className="text-base font-bold text-slate-950 font-sans"><MdText text={inhalt.texte.t4FestbetonFestigkeitsentwicklungElastisc} /></h2>
            </div>
            <button 
              onClick={() => setActiveTab('festbeton')}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-shiraz hover:bg-shiraz/90 text-white rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
            ><MdText text={inhalt.texte.festbetonkenngrößenÖffnen} /><ArrowRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 flex flex-col gap-3">
              <p className="text-xs text-slate-600 leading-relaxed font-sans"><MdText text={inhalt.texte.dieVerfestigungDesZementleims} /></p>

              <div className="p-3.5 bg-slate-50 border border-home-grau/30 rounded-lg text-xs font-sans grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-500 font-mono block text-[10px]"><MdText text={inhalt.texte.mittlereZentrischeZugfestigkeitF} /></span>
                  <div className="font-semibold text-slate-900 mt-1">
                    <FormulaText text="f_{ctm} = 0.3 \cdot (f_{ck})^{2/3}" />
                  </div>
                </div>
                <div>
                  <span className="text-slate-500 font-mono block text-[10px]"><MdText text={inhalt.texte.erhärtungsverlaufNachEurocode2} /></span>
                  <div className="font-semibold text-slate-900 mt-1">
                    <FormulaText text="\beta_{cc}(t) = \exp\left(s \cdot [1 - \sqrt{28/t}]\right)" />
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-slate-50 p-4 rounded-xl border border-home-grau/30">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2"><MdText text={inhalt.texte.festigkeitsklassenTrageigenschaftenDin10} /></span>
              <table className="min-w-full text-left text-[11px] text-slate-700">
                <thead>
                  <tr className="border-b border-home-grau/30 text-[9px] text-slate-400 font-bold uppercase">
                    <th className="pb-1">Klasse</th>
                    <th className="pb-1"><MdText text={inhalt.texte.zylFCkMpa} /></th>
                    <th className="pb-1"><MdText text={inhalt.texte.würfelFCkMpa} /></th>
                    <th className="pb-1"><MdText text={inhalt.texte.zugfFCtmMpa} /></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-mono">
                  <tr>
                    <td className="py-1 font-bold">C12/15</td>
                    <td className="py-1">12</td>
                    <td className="py-1">15</td>
                    <td className="py-1">1,6 MPa</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-bold">C20/25</td>
                    <td className="py-1">20</td>
                    <td className="py-1">25</td>
                    <td className="py-1">2,2 MPa</td>
                  </tr>
                  <tr className="text-slate-900 font-semibold bg-white/40">
                    <td className="py-1 font-sans font-bold">C25/30</td>
                    <td className="py-1">25</td>
                    <td className="py-1">30</td>
                    <td className="py-1">2,6 MPa</td>
                  </tr>
                  <tr className="text-slate-900 font-semibold bg-white/40">
                    <td className="py-1 font-sans font-bold">C30/37</td>
                    <td className="py-1">30</td>
                    <td className="py-1">37</td>
                    <td className="py-1">2,9 MPa</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-bold">C45/55</td>
                    <td className="py-1">45</td>
                    <td className="py-1">55</td>
                    <td className="py-1">3,8 MPa</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Pillar 5: Dauerhaftigkeit & Betondeckung */}
        <div className="bg-white border border-home-grau/30 rounded-xl p-6 shadow-sm flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-home-grau/30 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="text-shiraz" size={22} />
              <h2 className="text-base font-bold text-slate-950 font-sans"><MdText text={inhalt.texte.t5DauerhaftigkeitExpositionsklassenBetond} /></h2>
            </div>
            <button 
              onClick={() => setActiveTab('dauerhaftigkeit')}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-shiraz hover:bg-shiraz/90 text-white rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
            ><MdText text={inhalt.texte.dauerhaftigkeitsRechnerÖffnen} /><ArrowRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 flex flex-col gap-3">
              <p className="text-xs text-slate-600 leading-relaxed font-sans"><MdText text={inhalt.texte.umDieEingebetteteStahlbewehrung} /><FormulaText text="c_{nom}" /><MdText text={inhalt.texte.eingehaltenWerdenDieExpositionsklassen} /></p>

              <div className="p-3.5 bg-slate-50 border border-home-grau/30 rounded-lg text-xs font-sans space-y-2">
                <span className="font-bold text-slate-800 font-sans block"><MdText text={inhalt.texte.ermittlungDesNennmaßesC} /></span>
                <div className="font-mono text-xs text-slate-900 border-l-2 border-shiraz/45 pl-3 py-1">
                  <FormulaText text="c_{nom} = c_{min} + \Delta c_{dev}" />
                </div>
                <div className="text-[10px] text-slate-500 font-mono block">
                  Mit <FormulaText text="c_{min} = \max(c_{min,b}; c_{min,dur}; 10 \, \text{mm})" /><MdText text={inhalt.texte.dasVorhaltemaß} /><FormulaText text="\Delta c_{dev}" /><MdText text={inhalt.texte.beträgtStandardmäßig10Mm} /></div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-slate-50 p-4 rounded-xl border border-home-grau/30">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2"><MdText text={inhalt.texte.xcXdRichtlinienDer} /></span>
              <table className="min-w-full text-left text-[11px] text-slate-700">
                <thead>
                  <tr className="border-b border-home-grau/30 text-[9px] text-slate-400 font-bold uppercase">
                    <th className="pb-1">Expositionsklasse</th>
                    <th className="pb-1">Beschreibung</th>
                    <th className="pb-1 font-mono">c_min,dur</th>
                    <th className="pb-1 font-mono"><MdText text={inhalt.texte.cNomStandard} /></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-[11px]">
                  <tr>
                    <td className="py-1 font-bold">XC1</td>
                    <td className="py-1 text-slate-500"><MdText text={inhalt.texte.ständigTrockenInnenräume} /></td>
                    <td className="py-1 font-mono">10 mm</td>
                    <td className="py-1 font-mono">20 mm</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-bold">XC2 / XC3</td>
                    <td className="py-1 text-slate-500"><MdText text={inhalt.texte.nassMäßigFeucht} /></td>
                    <td className="py-1 font-mono">20 mm</td>
                    <td className="py-1 font-mono">30 mm</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-bold">XC4</td>
                    <td className="py-1 text-slate-600"><MdText text={inhalt.texte.direktBeregnetAußenwände} /></td>
                    <td className="py-1 font-mono">25 mm</td>
                    <td className="py-1 font-mono">35 mm</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-bold">XD1</td>
                    <td className="py-1 text-slate-500"><MdText text={inhalt.texte.mäßigFeuchtSprühkanal} /></td>
                    <td className="py-1 font-mono">35 mm</td>
                    <td className="py-1 font-mono">45 mm</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-bold">XD3</td>
                    <td className="py-1 text-slate-500"><MdText text={inhalt.texte.wechselndNassParkdecks} /></td>
                    <td className="py-1 font-mono">40 mm</td>
                    <td className="py-1 font-mono">50 mm</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Pillar 6: Beton-Instandsetzung */}
        <div className="bg-white border border-home-grau/30 rounded-xl p-6 shadow-sm flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-home-grau/30 pb-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="text-shiraz" size={22} />
              <h2 className="text-base font-bold text-slate-950 font-sans"><MdText text={inhalt.texte.t6BetonInstandsetzungSchadensbeseitigung} /></h2>
            </div>
            <button 
              onClick={() => setActiveTab('instandhaltung')}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-shiraz hover:bg-shiraz/90 text-white rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
            ><MdText text={inhalt.texte.instandhaltungSchutzÖffnen} /><ArrowRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 flex flex-col gap-3">
              <p className="text-xs text-slate-600 leading-relaxed font-sans"><MdText text={inhalt.texte.schädenDurchBetonalterungWerden} /></p>

              <div className="bg-white border border-y border-r border-home-grau/25 border-l-4 border-l-amber-500 p-3 rounded-lg text-xs text-slate-700 flex gap-2">
                <ShieldAlert size={16} className="text-amber-700 shrink-0 mt-0.5" />
                <div className="font-sans leading-relaxed text-[11px]"><MdText text={inhalt.texte.mindestabreißfestigkeitFCtSub} /></div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-slate-50 p-4 rounded-xl border border-home-grau/30 space-y-2 text-xs">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1"><MdText text={inhalt.texte.instandsetzungsprinzipienNachDinEn} /></span>
              
              <div className="bg-white p-2.5 rounded border border-home-grau/30">
                <span className="font-bold text-slate-800 text-[10.5px]"><MdText text={inhalt.texte.prinzipIKathodischerKorrosionsschutz} /></span>
                <p className="text-slate-500 text-[10px] mt-0.5"><MdText text={inhalt.texte.anlegenEinesSchwachenGeregelten} /></p>
              </div>

              <div className="bg-white p-2.5 rounded border border-home-grau/30">
                <span className="font-bold text-slate-800 text-[10.5px]"><MdText text={inhalt.texte.prinzipIiMechanischerMörtelersatz} /></span>
                <p className="text-slate-500 text-[10px] mt-0.5"><MdText text={inhalt.texte.entfernungDesGeschädigtenCarbonatbetons} /></p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* --- Part 7: Unified Checklist Item Overview --- */}
      <div className="bg-white border border-home-grau/30 rounded-xl p-6 shadow-sm flex flex-col gap-4">
        <div className="flex items-center gap-2 border-b border-home-grau/30 pb-3">
          <FileText className="text-slate-800" size={20} />
          <h2 className="text-base font-bold text-slate-950 font-sans"><MdText text={inhalt.texte.t7IngenieurChecklistePlanung} /></h2>
        </div>
        
        <p className="text-xs text-slate-600 leading-relaxed -mt-2"><MdText text={inhalt.texte.ganzheitlicheÜbersichtDerWichtigsten} /></p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-1">
          {/* Section A: Planning & Specifying */}
          <div className="bg-slate-50 border border-home-grau/30 rounded-xl p-4 flex flex-col gap-3">
            <span className="text-xs font-bold text-slate-900 block uppercase tracking-wider border-b border-home-grau/30 pb-1 font-sans"><MdText text={inhalt.texte.tragwerksplanungNormungSpezifikation} /></span>
            
            <div className="space-y-3.5 text-xs font-sans">
              <div className="flex gap-2.5 items-start">
                <CheckCircle2 size={16} className="text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-slate-800"><MdText text={inhalt.texte.xcXdGrenzwerteFestlegen} /></h4>
                  <p className="text-slate-500 text-[10.5px] mt-0.5"><MdText text={inhalt.texte.zulässigenWZWert} /></p>
                </div>
              </div>

              <div className="flex gap-2.5 items-start">
                <CheckCircle2 size={16} className="text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-slate-800"><MdText text={inhalt.texte.coZusatzstoffeOptimieren} /></h4>
                  <p className="text-slate-500 text-[10.5px] mt-0.5"><MdText text={inhalt.texte.nachhaltigkeitswertDurchDasK} /></p>
                </div>
              </div>

              <div className="flex gap-2.5 items-start">
                <CheckCircle2 size={16} className="text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-slate-800"><MdText text={inhalt.texte.bewehrungslageKonsistenzAufeinanderAbsti} /></h4>
                  <p className="text-slate-500 text-[10.5px] mt-0.5"><MdText text={inhalt.texte.beiKomplizierterEngerVerlegung} /></p>
                </div>
              </div>

              <div className="flex gap-2.5 items-start">
                <CheckCircle2 size={16} className="text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-slate-800"><MdText text={inhalt.texte.kriechenUndSchwindenEinkalkulieren} /></h4>
                  <p className="text-slate-500 text-[10.5px] mt-0.5"><MdText text={inhalt.texte.zeitabhängigeUndUmweltbedingteLängenände} /></p>
                </div>
              </div>
            </div>
          </div>

          {/* Section B: Execution & Field Verification */}
          <div className="bg-slate-50 border border-home-grau/30 rounded-xl p-4 flex flex-col gap-3">
            <span className="text-xs font-bold text-slate-900 block uppercase tracking-wider border-b border-home-grau/30 pb-1 font-sans"><MdText text={inhalt.texte.bauüberwachungBaustellenAusführung} /></span>
            
            <div className="space-y-3.5 text-xs font-sans">
              <div className="flex gap-2.5 items-start">
                <CheckCircle2 size={16} className="text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-slate-800"><MdText text={inhalt.texte.eignungsprüfungDesHerstellersAnfordern} /></h4>
                  <p className="text-slate-500 text-[10.5px] mt-0.5"><MdText text={inhalt.texte.sicherstellenDassVorBetonierbeginn} /></p>
                </div>
              </div>

              <div className="flex gap-2.5 items-start">
                <CheckCircle2 size={16} className="text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-slate-800"><MdText text={inhalt.texte.frühzeitigeNachbehandlungGewährleisten} /></h4>
                  <p className="text-slate-500 text-[10.5px] mt-0.5"><MdText text={inhalt.texte.unmittelbarNachEinbauFolienabdeckungen} /></p>
                </div>
              </div>

              <div className="flex gap-2.5 items-start">
                <CheckCircle2 size={16} className="text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-slate-800"><MdText text={inhalt.texte.sicherstellungDerAbstandshalter} /></h4>
                  <p className="text-slate-500 text-[10.5px] mt-0.5"><MdText text={inhalt.texte.prüfungVorEinbringungLückenlose} /></p>
                </div>
              </div>

              <div className="flex gap-2.5 items-start">
                <CheckCircle2 size={16} className="text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-slate-800"><MdText text={inhalt.texte.prüfungVonUntergrundhaftwerten} /></h4>
                  <p className="text-slate-500 text-[10.5px] mt-0.5"><MdText text={inhalt.texte.beiSanierungenDieSaubere} /></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ModuleFooter 
        weblinks={[
          { title: inhalt.werte.zementMerkblätterBetoningenieure, url: "https://www.beton.org/betonbau/planungshilfen/zementmerkblaetter/" },
          inhalt.daten["BetonAZ.weblinks.1"]
        ]} 
        wikipedia={[
          { title: 'Betontechnologie', url: 'https://de.wikipedia.org/wiki/Beton' },
          { title: 'Wasserzementwert', url: 'https://de.wikipedia.org/wiki/Wasserzementwert' }
        ]}
        normIds={['DIN_EN_206', 'DIN_1045_3', 'DIN_EN_1992_1_1', 'DIN_EN_13670', 'DBV_NACHBEHANDLUNG']}
        literatur={inhalt.daten["BetonAZ.literatur"]}
        formeln={inhalt.daten["BetonAZ.formeln"]}
      />

    </div>
  );
}
