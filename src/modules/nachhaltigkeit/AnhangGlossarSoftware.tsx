import { ExternalLink } from 'lucide-react';
import inhalt from '@/content/nachhaltigkeit/AnhangGlossarSoftware.json';
import { MdText } from '@/src/components/inhalt/MdText';

export default function AnhangGlossarSoftware() {
  return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-6 animate-in fade-in duration-200">
        <div className="border-b border-home-grau/25 pb-3">
          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Anhang 5</span>
          <h3 className="text-base font-extrabold text-slate-900 mt-1"><MdText text={inhalt.texte.epilogGlossarWerkzeugeNormative} /></h3>
        </div>

        <div className="space-y-3.5">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-stone-100 pb-1.5"><MdText text={inhalt.texte.glossarDerÖkobilanzierungKurzfassung} /></h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {inhalt.daten.AnhangGlossarSoftware.map((item, idx) => (
              <div key={idx} className="p-3 bg-slate-50/50 rounded-lg border border-stone-200/60 leading-normal">
                <strong className="text-[11px] font-mono text-slate-900 block font-bold">{item.term}</strong>
                <span className="text-[10px] text-slate-500 block pt-1">{item.def}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3.5 pt-4 border-t border-stone-100">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-stone-100 pb-1.5"><MdText text={inhalt.texte.werkzeugeDatenbankenSoftware} /></h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-slate-50 border border-stone-200 rounded-lg flex flex-col justify-between">
              <div>
                <strong className="text-xs text-slate-950 block font-bold leading-tight"><MdText text={inhalt.texte.ökobaudatBbsr} /></strong>
                <p className="text-[10px] text-slate-500 mt-1.5 leading-snug"><MdText text={inhalt.texte.zentralesDeutschesReferenzregisterFür} /></p>
              </div>
              <a href="https://www.oekobaudat.de" target="_blank" rel="noreferrer" className="text-[10px] text-emerald-700 font-bold hover:underline flex items-center gap-1 mt-3">
                oekobaudat.de <ExternalLink size={10} />
              </a>
            </div>

            <div className="p-3 bg-slate-50 border border-stone-200 rounded-lg flex flex-col justify-between">
              <div>
                <strong className="text-xs text-slate-950 block font-bold leading-tight">eLCA (BBSR)</strong>
                <p className="text-[10px] text-slate-500 mt-1.5 leading-snug"><MdText text={inhalt.texte.webbasierteKostenfreieSoftwareDes} /></p>
              </div>
              <a href="https://www.bauteileditor.de" target="_blank" rel="noreferrer" className="text-[10px] text-emerald-700 font-bold hover:underline flex items-center gap-1 mt-3">
                bauteileditor.de <ExternalLink size={10} />
              </a>
            </div>

            <div className="p-3 bg-slate-50 border border-stone-200 rounded-lg flex flex-col justify-between">
              <div>
                <strong className="text-xs text-slate-950 block font-bold leading-tight"><MdText text={inhalt.texte.openlcaGreendelta} /></strong>
                <p className="text-[10px] text-slate-500 mt-1.5 leading-snug"><MdText text={inhalt.texte.hervorragendesKostenlosesOpenSource} /></p>
              </div>
              <a href="https://www.openlca.org" target="_blank" rel="noreferrer" className="text-[10px] text-emerald-700 font-bold hover:underline flex items-center gap-1 mt-3">
                openlca.org <ExternalLink size={10} />
              </a>
            </div>
          </div>
        </div>

        <div className="space-y-3.5 pt-4 border-t border-stone-100">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-stone-100 pb-1.5"><MdText text={inhalt.texte.normativeQuellennachweiseNormenhierarchi} /></h4>
          <ul className="text-[11px] text-slate-650 space-y-1.5 list-disc pl-5 leading-relaxed">
            <li><MdText text={inhalt.texte.iso14040Iso14044} /></li>
            <li><MdText text={inhalt.texte.iso14025LeitfadenZur} /></li>
            <li><MdText text={inhalt.texte.dinEn15804A2} /></li>
            <li><MdText text={inhalt.texte.dinEn15978Berechnungsmethode} /></li>
            <li><MdText text={inhalt.texte.din27712021} /></li>
            <li><MdText text={inhalt.texte.gegDinV18599} /></li>
          </ul>
        </div>

      </div>
    );
}
