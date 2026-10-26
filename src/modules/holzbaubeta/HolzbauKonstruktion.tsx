import { Layers } from 'lucide-react';
import inhalt from '@/content/holzbaubeta/HolzbauKonstruktion.json';
import { MdText } from '@/src/components/inhalt/MdText';

export default function HolzbauKonstruktion() {
  return (
      <div className="flex flex-col gap-6 animate-in fade-in duration-300" id="holz_tab_konstruktion">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-white p-5 rounded-xl border border-home-grau/30 hover:border-amber-400 transition-all flex flex-col gap-3">
            <span className="text-[10px] font-black text-amber-800 uppercase tracking-widest">Bauweise A</span>
            <h3 className="font-extrabold text-text-main text-base"><MdText text={inhalt.texte.holzrahmenHolztafelbau} /></h3>
            <p className="text-xs text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.stabförmigesTragwerkAusKonstruktionsvoll} /></p>
            <div className="text-[11px] font-semibold text-amber-900 bg-amber-50 p-2.5 rounded-lg border border-amber-100/60 mt-2"><MdText text={inhalt.texte.einsatzEinfamilienhäuserHocheffizientePa} /></div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-home-grau/30 hover:border-amber-400 transition-all flex flex-col gap-3">
            <span className="text-[10px] font-black text-amber-800 uppercase tracking-widest">Bauweise B</span>
            <h3 className="font-extrabold text-text-main text-base"><MdText text={inhalt.texte.massivholzbauBspClt} /></h3>
            <p className="text-xs text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.flächigeMehrschichtigeTragwerkeAus} /></p>
            <div className="text-[11px] font-semibold text-amber-900 bg-amber-50 p-2.5 rounded-lg border border-amber-100/60 mt-2"><MdText text={inhalt.texte.einsatzMehrgeschossigerWohnungsbauGebäud} /></div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-home-grau/30 hover:border-amber-400 transition-all flex flex-col gap-3">
            <span className="text-[10px] font-black text-amber-800 uppercase tracking-widest">Bauweise C</span>
            <h3 className="font-extrabold text-text-main text-base"><MdText text={inhalt.texte.holzskelettbauPfostenRiegelBauweise} /></h3>
            <p className="text-xs text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.pfostenRiegelSystemUnter} /></p>
            <div className="text-[11px] font-semibold text-amber-900 bg-amber-50 p-2.5 rounded-lg border border-amber-100/60 mt-2"><MdText text={inhalt.texte.einsatzGewerbeUndIndustriebauten} /></div>
          </div>

        </div>

        {/* Interactive Layered Diagram for CLT Floor */}
        <div className="bg-white p-5 rounded-xl border border-home-grau/30 flex flex-col md:flex-row gap-6">

          <div className="flex flex-col gap-4 max-w-md w-full">
            <h3 className="font-black text-text-main text-sm flex items-center gap-2">
              <Layers size={16} className="text-amber-800" /><MdText text={inhalt.texte.detailaufbauMassivholzGeschossdeckeDatah} /></h3>
            <p className="text-xs text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.eineGebundeneSplittschüttung60} /></p>

            <div className="flex flex-col gap-1.5 text-xs text-text-main/80">
              <div className="flex gap-2 items-center"><span className="w-2.5 h-2.5 bg-[#4f46e5] rounded" /><MdText text={inhalt.texte.anhydritHeizestrich65Mm} /></div>
              <div className="flex gap-2 items-center"><span className="w-2.5 h-2.5 bg-[#3b82f6] rounded" /><MdText text={inhalt.texte.trittschalldämmungTdpt30Mm} /></div>
              <div className="flex gap-2 items-center"><span className="w-2.5 h-2.5 bg-[#78716c] rounded" /><MdText text={inhalt.texte.gebundeneSchwereTragschüttung60} /></div>
              <div className="flex gap-2 items-center"><span className="w-2.5 h-2.5 bg-[#d97706] rounded" /><MdText text={inhalt.texte.brettsperrholzKernClt140} /></div>
            </div>
          </div>

          {/* Simulated 2D Render of Floor stack */}
          <div className="flex-grow flex flex-col gap-1 bg-off-white/50 p-4 rounded-xl border border-home-grau/25 min-h-[180px] justify-center">
            <div className="w-full bg-[#4f46e5] text-white text-[10px] font-mono p-1 text-center font-bold tracking-wider rounded-t-lg"><MdText text={inhalt.texte.estrich65Mm} /></div>
            <div className="w-full bg-[#1d4ed8] text-white text-[10px] font-mono p-1.5 text-center font-bold tracking-wider"><MdText text={inhalt.texte.trittschallminderung30Mm} /></div>
            <div className="w-full bg-[#78716c] text-white text-[10px] font-mono p-2.5 text-center font-bold tracking-wider"><MdText text={inhalt.texte.schüttungsmasseZurTrittschallDämpfung} /></div>
            <div className="w-full bg-[#b45309] text-white text-[10px] font-mono p-4 text-center font-black tracking-wider rounded-b-lg"><MdText text={inhalt.texte.bspCltBrettsperrholzTragscheibe} /><div className="flex justify-around mt-1">
                <span className="border-t border-white/50 w-full text-[8px] italic">Sichtqualität-Unterseite</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    );
}
