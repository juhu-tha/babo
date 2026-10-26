import { ShieldCheck, AlertTriangle } from 'lucide-react';
import inhalt from '@/content/nachhaltigkeit/LeitfadenEpdKonzepte.json';
import { MdText } from '@/src/components/inhalt/MdText';

export default function LeitfadenEpdKonzepte() {
  return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-5 animate-in fade-in duration-200">
        <div className="border-b border-home-grau/25 pb-3">
          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest"><MdText text={inhalt.texte.schritt1Von5} /></span>
          <h3 className="text-base font-extrabold text-slate-900 mt-1"><MdText text={inhalt.texte.grundkonzeptEpdWahlGenerische} /></h3>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed"><MdText text={inhalt.texte.derEinstiegInJede} /></p>

        {/* Comparative Matrix table */}
        <div className="border border-home-grau/30 rounded-xl overflow-hidden shadow-2xs">
          <div className="bg-slate-50 p-2.5 border-b border-home-grau/20 grid grid-cols-3 gap-2 text-[10px] font-bold uppercase text-slate-800 tracking-wide">
            <div>Kriterium</div>
            <div><MdText text={inhalt.texte.generischeEpdZB} /></div>
            <div><MdText text={inhalt.texte.spezifischeHerstellerEpd} /></div>
          </div>

          {inhalt.daten.LeitfadenEpdKonzepte.map((row, r_idx) => (
            <div key={r_idx} className="p-3 grid grid-cols-3 gap-2 text-xs border-b border-stone-100 last:border-0 hover:bg-slate-50/50 transition-colors">
              <div className="font-bold text-slate-900 text-[11px]">{row.krit}</div>
              <div className="text-slate-600 leading-relaxed text-[11px]">{row.gen}</div>
              <div className="text-emerald-950 leading-relaxed text-[11px]">{row.spec}</div>
            </div>
          ))}
        </div>

        {/* PCR Explanation Panel (Product Category Rules) */}
        <div className="bg-emerald-50/15 border border-emerald-100 rounded-xl p-4 space-y-2.5">
          <div className="flex items-center gap-2 text-emerald-800">
            <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
            <strong className="text-xs font-black uppercase tracking-wider font-mono"><MdText text={inhalt.texte.exkursWasSindPcr} /></strong>
          </div>
          <p className="text-[11px] text-slate-650 leading-relaxed font-sans"><MdText text={inhalt.texte.eineEpdDarfNicht} /></p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[10px] mt-1">
            <div className="bg-white/60 p-2.5 rounded border border-stone-200/50 space-y-1">
              <span className="font-extrabold text-emerald-900 block font-mono"><MdText text={inhalt.texte.partAAllgemeineRechenregeln} /></span>
              <p className="text-slate-500 leading-normal font-normal font-sans"><MdText text={inhalt.texte.giltÜbergreifendFürAlle} /></p>
            </div>
            <div className="bg-white/60 p-2.5 rounded border border-stone-200/50 space-y-1">
              <span className="font-extrabold text-emerald-900 block font-mono"><MdText text={inhalt.texte.partBSpezifischeBaustoffklasse} /></span>
              <p className="text-slate-500 leading-normal font-normal font-sans"><MdText text={inhalt.texte.giltFürEineKonkrete} /></p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-y border-r border-home-grau/25 border-l-4 border-l-amber-500 p-4 rounded-xl flex items-start gap-3">
          <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={16} />
          {/* DIN EN 15804+A2 Kernindikatoren */}
          <div className="p-4 bg-off-white rounded-xl border border-home-grau/25 space-y-2">
            <div className="flex items-center justify-between border-b border-home-grau/15 pb-1.5">
              <strong className="text-xs text-text-main font-bold"><MdText text={inhalt.texte.dinEn15804A2} /></strong>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold"><MdText text={inhalt.texte.ökobaudatStandard} /></span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
              <div className="p-2 bg-white rounded border border-home-grau/15">
                <span className="font-bold text-shiraz font-mono block">GWP-total</span>
                <span className="text-[10px] text-text-main/70"><MdText text={inhalt.texte.gesamtesErderwärmungspotenzialFossilBiog} /></span>
              </div>
              <div className="p-2 bg-white rounded border border-home-grau/15">
                <span className="font-bold text-text-main font-mono block">GWP-fossil</span>
                <span className="text-[10px] text-text-main/70"><MdText text={inhalt.texte.fossileTreibhausgasemissionenAusBrennsto} /></span>
              </div>
              <div className="p-2 bg-white rounded border border-home-grau/15">
                <span className="font-bold text-emerald-700 font-mono block">GWP-biogenic</span>
                <span className="text-[10px] text-text-main/70"><MdText text={inhalt.texte.biogenerKohlenstoffTemporäreCo} /></span>
              </div>
              <div className="p-2 bg-white rounded border border-home-grau/15">
                <span className="font-bold text-indigo-700 font-mono block">PENRT</span>
                <span className="text-[10px] text-text-main/70"><MdText text={inhalt.texte.totalNichtErneuerbarePrimärenergie} /></span>
              </div>
              <div className="p-2 bg-white rounded border border-home-grau/15">
                <span className="font-bold text-amber-700 font-mono block">PERT</span>
                <span className="text-[10px] text-text-main/70"><MdText text={inhalt.texte.totalErneuerbarePrimärenergieMj} /></span>
              </div>
              <div className="p-2 bg-white rounded border border-home-grau/15">
                <span className="font-bold text-slate-700 font-mono block">ÖKOBAUDAT</span>
                <span className="text-[10px] text-text-main/70"><MdText text={inhalt.texte.verbindlicheBundesplattformDesBmwsb} /></span>
              </div>
            </div>
          </div>

          <div className="text-xs text-amber-950 leading-relaxed">
            <strong className="font-bold block mb-1"><MdText text={inhalt.texte.akademischerPraxistippFürDie} /></strong><MdText text={inhalt.texte.beginnenSieImVorentwurf} /></div>
        </div>
      </div>
    );
}
