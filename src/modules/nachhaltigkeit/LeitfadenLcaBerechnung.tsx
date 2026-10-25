import { FormulaText } from '@/src/components/ui/FormulaText';
import { Globe, Building } from 'lucide-react';
import inhalt from '@/content/nachhaltigkeit/LeitfadenLcaBerechnung.json';
import { MdText } from '@/src/components/inhalt/MdText';

export default function LeitfadenLcaBerechnung() {
  return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-5 animate-in fade-in duration-200">
        <div className="border-b border-home-grau/25 pb-3">
          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest"><MdText text={inhalt.texte.schritt4Von5} /></span>
          <h3 className="text-base font-extrabold text-slate-900 mt-1"><MdText text={inhalt.texte.berechnungDerLcaIndikatoren} /></h3>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed"><MdText text={inhalt.texte.nachdemDieSchichtenMassen} /></p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3 bg-red-50/40 border border-red-100 rounded-lg">
            <strong className="text-xs text-red-900 block font-bold">GWP-fossil</strong>
            <p className="text-[10px] text-slate-600 leading-relaxed mt-1"><MdText text={inhalt.texte.erfasstEmissionenAusFossilen} /></p>
          </div>
          <div className="p-3 bg-teal-50/45 border border-teal-100 rounded-lg">
            <strong className="text-xs text-teal-900 block font-bold">GWP-biogenic</strong>
            <p className="text-[10px] text-slate-600 leading-relaxed mt-1"><MdText text={inhalt.texte.coSpeicherleistungNachwachsenderBaustoff} /></p>
          </div>
          <div className="p-3 bg-amber-50/40 border border-amber-100 rounded-lg">
            <strong className="text-xs text-amber-900 block font-bold"><MdText text={inhalt.texte.penrtPere} /></strong>
            <p className="text-[10px] text-slate-600 leading-relaxed mt-1"><MdText text={inhalt.texte.primärenergieverbrauchNichtErneuerbarErn} /></p>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border border-stone-200 rounded-xl">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider mb-2"><MdText text={inhalt.texte.exemplarischesRechenbeispiel1M} /></span>
          <div className="space-y-2 text-[11px] leading-relaxed">
            <p className="font-bold text-slate-800 flex flex-wrap items-center gap-1"><MdText text={inhalt.texte.gegebenSchicht16Cm} /><FormulaText text="\rho = 20\,\mathrm{kg/m^3}" />, <FormulaText text="GWP_{\mathrm{A1\text{-}A3}} = 3{,}25\,\mathrm{kg\,CO_2\text{-}eq/kg}" />)
            </p>
            <div className="bg-white p-3.5 rounded-lg border border-stone-200/60 flex flex-col gap-2">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1.5">
                <span className="text-[9px] bg-slate-100 text-slate-600 font-bold px-1.5 py-0.5 rounded uppercase self-start sm:self-auto shrink-0 font-mono"><MdText text={inhalt.texte.t1MasseProM} /></span>
                <FormulaText text="M_i = d_i \cdot 1\,\mathrm{m^2} \cdot \rho_i = 0{,}16\,\mathrm{m} \cdot 1\,\mathrm{m^2} \cdot 20\,\mathrm{kg/m^3} = 3{,}2\,\mathrm{kg/m^2}" className="text-xs font-semibold text-slate-700 font-mono" />
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1.5">
                <span className="text-[9px] bg-slate-100 text-slate-600 font-bold px-1.5 py-0.5 rounded uppercase self-start sm:self-auto shrink-0 font-mono"><MdText text={inhalt.texte.t2GwpA1A3} /></span>
                <FormulaText text="GWP_{\mathrm{A1\text{-}A3}} = M_i \cdot gwp_{\mathrm{fossil}} = 3{,}2\,\mathrm{kg/m^2} \cdot 3{,}25\,\mathrm{kg\,CO_2\text{-}eq/kg} = 10{,}4\,\mathrm{kg\,CO_2\text{-}eq/m^2}" className="text-xs font-semibold text-shiraz font-mono" />
              </div>
            </div>
            <p className="text-[10px] text-slate-500"><MdText text={inhalt.texte.wiederholenSieDieseSummenrechnung} /></p>
          </div>
        </div>

        {/* Weitere EPD-Wirkungsindikatoren Grid */}
        <div className="bg-slate-50/50 border border-stone-150 rounded-xl p-4 flex flex-col gap-3">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-stone-200 pb-2">
            <Globe size={14} className="text-emerald-700" /><MdText text={inhalt.texte.weitereÖkologischeEpdWirkungsindikatoren} /></h4>
          <p className="text-xs text-slate-600 leading-relaxed"><MdText text={inhalt.texte.eineVollständigeEpdDeklariert} /></p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
            {inhalt.daten.LeitfadenLcaBerechnung.map((ind, i_idx) => (
              <div key={i_idx} className="bg-white p-3 rounded-lg border border-stone-150 flex flex-col justify-between hover:shadow-2xs transition-all">
                <div>
                  <strong className="text-[11px] text-slate-900 block font-bold leading-tight">{ind.name}</strong>
                  <p className="text-[10px] text-slate-500 mt-1 leading-snug">{ind.desc}</p>
                </div>
                <div className="mt-2 pt-1.5 border-t border-stone-100 flex items-center justify-between text-[10px]">
                  <span className="font-semibold text-emerald-800">Einheit: {ind.unit}</span>
                  <span className="text-[9px] text-slate-400 font-mono italic">{ind.ref}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-stone-50 border border-stone-200 p-4 rounded-xl flex items-start gap-3">
          <Building className="text-slate-600 shrink-0 mt-0.5" size={16} />
          <div className="text-xs text-slate-800 leading-relaxed">
            <strong className="font-bold block mb-1"><MdText text={inhalt.texte.verbindungZuInnovativenBaumaterialien} /></strong><MdText text={inhalt.texte.dieEinführungZerspanungsfreierCarbonbewe} /></div>
        </div>
      </div>
    );
}
