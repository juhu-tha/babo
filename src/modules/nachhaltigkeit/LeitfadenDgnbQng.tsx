import { AlertTriangle, Recycle } from 'lucide-react';
import inhalt from '@/content/nachhaltigkeit/LeitfadenDgnbQng.json';
import { MdText } from '@/src/components/inhalt/MdText';

export default function LeitfadenDgnbQng() {
  return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-5 animate-in fade-in duration-200">
        <div className="border-b border-home-grau/25 pb-3">
          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest"><MdText text={inhalt.texte.schritt5Von5} /></span>
          <h3 className="text-base font-extrabold text-slate-900 mt-1"><MdText text={inhalt.texte.dgnbQngZertifizierungsprozessQualitätssi} /></h3>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed"><MdText text={inhalt.texte.nachAbschlussDerBauteilbilanzierung} /></p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* DGNB Column */}
          <div className="p-4 bg-emerald-50/20 border border-emerald-100 rounded-xl flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[10px] uppercase rounded">DGNB</span>
              <strong className="text-xs font-bold text-slate-900">DGNB-Zertifizierungssystem</strong>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed"><MdText text={inhalt.texte.einGanzheitlicherFreiwilligerSystemansat} /></p>
            <ul className="text-[10px] text-slate-500 space-y-1 list-disc pl-4 leading-normal">
              <li><MdText text={inhalt.texte.auszeichnungsklassenPlatin80Gold} /></li>
              <li><MdText text={inhalt.texte.verbindetÖkobilanzGwpOdp} /></li>
              <li><MdText text={inhalt.texte.fördertSortenreinenModulrückbauDurch} /></li>
            </ul>
          </div>

          {/* QNG Column */}
          <div className="p-4 bg-sky-50/20 border border-sky-100 rounded-xl flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-sky-100 text-sky-800 font-bold text-[10px] uppercase rounded">QNG</span>
              <strong className="text-xs font-bold text-slate-900"><MdText text={inhalt.texte.qngSiegelBmwsb} /></strong>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed"><MdText text={inhalt.texte.dasStaatlicheQualitätssiegelNachhaltiges} /></p>
            <ul className="text-[10px] text-slate-500 space-y-1 list-disc pl-4 leading-normal">
              <li><MdText text={inhalt.texte.qngPlus24Kg} /></li>
              <li><MdText text={inhalt.texte.qngPremium20Kg} /></li>
              <li><MdText text={inhalt.texte.striktePflichtenZurSchadstofffreien} /></li>
            </ul>
          </div>

        </div>

        {/* Intersect with Schadstoffvermeidung */}
        <div className="bg-white border border-y border-r border-home-grau/25 border-l-4 border-l-amber-500 rounded-xl p-4 flex flex-col gap-2">
          <h4 className="text-xs font-bold text-amber-950 flex items-center gap-1.5 uppercase">
            <AlertTriangle size={14} className="text-amber-700" /><MdText text={inhalt.texte.schadstoffvermeidungAlsQngAusschlusskrit} /></h4>
          <p className="text-[11px] text-amber-950 leading-relaxed"><MdText text={inhalt.texte.dasBesteGebäudeGwp} /></p>
        </div>

        {/* Urban Mining Index (UMI) & Zirkularitäts-Kennwerte */}
        <div className="bg-white border border-home-grau/25 rounded-xl p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-home-grau/15 pb-2">
            <h4 className="text-xs font-bold text-text-main uppercase tracking-wider flex items-center gap-1.5">
              <Recycle size={14} className="text-shiraz" /><MdText text={inhalt.texte.zirkularitätsmetrikenUrbanMiningIndex} /></h4>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200"><MdText text={inhalt.texte.zirkuläresBauen} /></span>
          </div>
          <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.moderneÖkobilanzierungenUndDgnb} /></p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-off-white rounded-lg border border-home-grau/15 space-y-1">
              <span className="font-bold text-shiraz block text-xs"><MdText text={inhalt.texte.urbanMiningIndexUmi} /></span>
              <p className="text-[11px] text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.gibtAnWieViel} /></p>
            </div>
            <div className="p-3 bg-off-white rounded-lg border border-home-grau/15 space-y-1">
              <span className="font-bold text-indigo-700 block text-xs"><MdText text={inhalt.texte.materialpässeMadasterDinSpec} /></span>
              <p className="text-[11px] text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.digitaleInventarisierungAllerVerbauten} /></p>
            </div>
            <div className="p-3 bg-off-white rounded-lg border border-home-grau/15 space-y-1">
              <span className="font-bold text-emerald-700 block text-xs"><MdText text={inhalt.texte.trennbarkeitVonVerbundbauteilen} /></span>
              <p className="text-[11px] text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.präferenzMechanischLösbarerVerbindungen} /></p>
            </div>
          </div>
        </div>

        {/* QNG Qualitätsstufen Schadstoffvermeidung (Dokument 313) */}
        <div className="bg-white border border-home-grau/25 rounded-xl p-4 flex flex-col gap-3">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-stone-200 pb-2">
            <AlertTriangle size={14} className="text-amber-600" /><MdText text={inhalt.texte.qngSchadstoffvermeidungQualitätsstufenQs} /></h4>
          <p className="text-xs text-slate-600 leading-relaxed"><MdText text={inhalt.texte.nebenDenGwpGrenzdaten} /></p>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 mt-1">
            {inhalt.daten.LeitfadenDgnbQng.map((item, idx) => (
              <div key={idx} className={`p-2.5 rounded-lg border flex flex-col gap-1 ${item.style}`}>
                <strong className="text-[11px] uppercase tracking-wider block font-bold">{item.stufe}</strong>
                <span className="text-[9px] font-bold block leading-tight">{item.title}</span>
                <p className="text-[9px] text-slate-600 mt-1 leading-normal font-normal">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    );
}
