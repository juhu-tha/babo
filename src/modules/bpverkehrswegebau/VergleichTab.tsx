// Ausgelagert aus src/modules/BpVerkehrswegebau.tsx (AP 5.2)
import { Layers } from 'lucide-react';
import inhalt from '@/content/bpverkehrswegebau/VergleichTab.json';
import { MdText } from '@/src/components/inhalt/MdText';

export default function VergleichTab() {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200">
        <h3 className="font-bold text-text-main text-sm uppercase tracking-wider mb-2"><MdText text={inhalt.texte.asphaltmischgutBetonoberbauImVergleich} /></h3>
        <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.asphaltImStraßenbauIst} /></p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Asphaltbeton */}
        <div className="bg-white p-4 rounded-xl border border-zinc-200 hover:border-zinc-400 hover:shadow-sm transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-zinc-500 uppercase font-mono">EN 13108-1</span>
              <span className="text-[10px] bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-extrabold font-sans">Klassiker</span>
            </div>
            <h4 className="font-bold text-base text-zinc-800 mb-1"><MdText text={inhalt.texte.asphaltbetonAc} /></h4>
            <p className="text-xs text-text-main/70 leading-relaxed explanation-box"><MdText text={inhalt.texte.gestuftesKorngerüstMitKontinuierlicher} /></p>
          </div>
          <div className="border-t border-zinc-100 pt-3 mt-3 text-[11px] text-zinc-600 font-mono">
            <div>Hohlraum: <span className="text-zinc-900 font-semibold">1,5 - 4,5 %</span></div>
            <div>Bitumen: <span className="text-zinc-900 font-semibold"><MdText text={inhalt.texte.ca56M} /></span></div>
          </div>
        </div>

        {/* Splittmastixasphalt */}
        <div className="bg-white p-4 rounded-xl border border-zinc-200 hover:border-zinc-400 hover:shadow-sm transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-zinc-500 uppercase font-mono">EN 13108-5</span>
              <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-extrabold font-sans">High-Quality</span>
            </div>
            <h4 className="font-bold text-base text-zinc-800 mb-1"><MdText text={inhalt.texte.splittmastixSma} /></h4>
            <p className="text-xs text-text-main/70 leading-relaxed explanation-box"><MdText text={inhalt.texte.ausfallkörnungMitSplittgerüstSplitt} /></p>
          </div>
          <div className="border-t border-zinc-100 pt-3 mt-3 text-[11px] text-zinc-600 font-mono">
            <div>Hohlraum: <span className="text-zinc-900 font-semibold">3,0 - 4,0 %</span></div>
            <div>Bitumen: <span className="text-zinc-900 font-semibold"><MdText text={inhalt.texte.ca657} /></span></div>
          </div>
        </div>

        {/* Gussasphalt */}
        <div className="bg-white p-4 rounded-xl border border-zinc-200 hover:border-zinc-400 hover:shadow-sm transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-zinc-500 uppercase font-mono">EN 13108-6</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-extrabold font-sans">Walzfrei</span>
            </div>
            <h4 className="font-bold text-base text-zinc-800 mb-1"><MdText text={inhalt.texte.gussasphaltMa} /></h4>
            <p className="text-xs text-text-main/70 leading-relaxed explanation-box"><MdText text={inhalt.texte.hohlraumfreiesMischgutBitumenmengenSind} /></p>
          </div>
          <div className="border-t border-zinc-100 pt-3 mt-3 text-[11px] text-zinc-600 font-mono">
            <div>Hohlraum: <span className="text-zinc-900 font-semibold"><MdText text={inhalt.texte.völligDicht0} /></span></div>
            <div>Bitumen: <span className="text-zinc-900 font-semibold"><MdText text={inhalt.texte.ca758} /></span></div>
          </div>
        </div>

        {/* Offenporiger Asphalt */}
        <div className="bg-white p-4 rounded-xl border border-zinc-200 hover:border-zinc-400 hover:shadow-sm transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-zinc-500 uppercase font-mono">EN 13108-7</span>
              <span className="text-[10px] bg-rose-100 text-rose-800 px-2 py-0.5 rounded font-extrabold font-sans">Akustik</span>
            </div>
            <h4 className="font-bold text-base text-zinc-800 mb-1"><MdText text={inhalt.texte.flüsterasphaltPa} /></h4>
            <p className="text-xs text-text-main/70 leading-relaxed explanation-box"><MdText text={inhalt.texte.sehrHoherZusammenhängenderHohlraumgehalt} /></p>
          </div>
          <div className="border-t border-zinc-100 pt-3 mt-3 text-[11px] text-zinc-600 font-mono">
            <div>Hohlraum: <span className="text-zinc-900 font-semibold"><MdText text={inhalt.texte.t220Vol} /></span></div>
            <div>Bitumen: <span className="text-zinc-900 font-semibold"><MdText text={inhalt.texte.ca556} /></span></div>
          </div>
        </div>
      </div>

      {/* Tragschichten ungebunden vs. gebunden */}
      <div className="bg-white p-5 rounded-xl border border-home-grau/30 shadow-xs">
        <h4 className="font-extrabold text-sm text-text-main mb-3 uppercase tracking-wider flex items-center gap-2">
          <Layers size={16} /><MdText text={inhalt.texte.untereTragschichtenUngebundeneBauweisen} /></h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-text-main/80 leading-relaxed">
          <div className="p-4 bg-zinc-50 rounded-lg border border-zinc-200">
            <h5 className="font-bold text-zinc-800 mb-1 flex items-center gap-1">
              <span><MdText text={inhalt.texte.schottertragschichtStsFrostschutzFss} /></span>
            </h5>
            <p className="mt-1"><MdText text={inhalt.texte.trägtLastenReinÜber} /></p>
          </div>
          <div className="p-4 bg-zinc-50 rounded-lg border border-zinc-200">
            <h5 className="font-bold text-slate-800 mb-1 flex items-center gap-1">
              <span><MdText text={inhalt.texte.zementstabilisierungHgtVerfestigung} /></span>
            </h5>
            <p className="mt-1"><MdText text={inhalt.texte.hydraulischGebundeneTragschichtenHgt} /></p>
          </div>
        </div>
      </div>
    </div>
  );
}
