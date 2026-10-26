// Ausgelagert aus src/modules/Stahlbetoninstandhaltung.tsx (AP 5.2)
import { Shield, Wrench, Droplets, Layers } from 'lucide-react';
import { FormulaText } from '@/src/components/ui/FormulaText';
import { BlockMath } from 'react-katex';
import { formatDeWert } from '@/src/utils/numberFormat';
import { en1504Prinzipien } from './daten';
import inhalt from '@/content/stahlbetoninstandhaltung/En1504Tab.json';
import { MdText } from '@/src/components/inhalt/MdText';

export default function En1504Tab() {
  return (
    <div className="space-y-6">
      <div className="bg-white border-y border-r border-l-4 border-emerald-500 border-home-grau/20 p-4 rounded-xl">
        <h3 className="font-bold text-emerald-800 flex items-center gap-2">
          <Shield size={20} /><MdText text={inhalt.texte.dinEn1504Produkte} /></h3>
        <p className="text-emerald-900 mt-2 text-sm">
          <FormulaText text={inhalt.werte.dieEuropäischeNormenreiheDin} />
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {en1504Prinzipien.map((prinzip) => (
          <div key={prinzip.id} className="bg-white p-5 rounded-xl shadow-sm border border-home-grau/30 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-shiraz/5 flex items-center justify-center font-bold text-shiraz shrink-0 border border-shiraz/10">
                  {formatDeWert(prinzip.id)}
                </div>
                <div>
                  <span className="text-xs font-bold text-home-grau uppercase tracking-wider">{prinzip.code}</span>
                  <h4 className="font-bold text-text-main leading-tight">{prinzip.name}</h4>
                </div>
              </div>
              <p className="text-sm text-text-main/90 mb-4 bg-off-white p-3 rounded-lg border border-home-grau/10 min-h-[70px] flex items-center"><FormulaText text={prinzip.desc} /></p>
            </div>
            
            {/* Examples Section */}
            <div className="mt-2 border-t border-home-grau/30 pt-3">
              <span className="text-xs font-bold text-shiraz uppercase tracking-wider block mb-2">Instandsetzungsverfahren:</span>
              <ul className="list-disc pl-4 space-y-1.5">
                {prinzip.examples.map((ex, exIdx) => (
                  <li key={exIdx} className="text-xs text-text-main leading-relaxed">
                    <FormulaText text={ex} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* DETAILED FOCUS SECTION: RISSINJEKTION & CARBONLAMELLEN */}
      <div className="bg-slate-50 p-6 rounded-2xl border border-home-grau/30 shadow-sm space-y-6 mt-6">
        <h3 className="font-extrabold text-lg text-slate-950 flex items-center gap-2 border-b border-home-grau/20 pb-3">
          <Wrench className="text-shiraz" size={22} /><MdText text={inhalt.texte.fokusSanierungsverfahrenRissinjektionCar} /></h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* 1. RISSINJEKTION */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/25 space-y-4">
            <h4 className="font-bold text-sm text-shiraz flex items-center gap-2 border-b border-slate-100 pb-2">
              <Droplets size={18} /><MdText text={inhalt.texte.rissinjektionRissverpressungDinEn} /></h4>
            <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.risseImBetonBeeinträchtigen} /></p>

            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-lg border border-home-grau/15 space-y-1">
                <span className="font-bold text-xs text-slate-900 block"><MdText text={inhalt.texte.klassifizierungDerInjektionsstoffeFüllgü} /></span>
                <ul className="text-[11px] text-text-main/95 space-y-2 leading-relaxed">
                  <li><MdText text={inhalt.texte.fKraftschlüssigesFüllenKraftübertragend} /></li>
                  <li><MdText text={inhalt.texte.dDehnfähigesFüllenAbdichtend} /></li>
                  <li><MdText text={inhalt.texte.sQuellfähigesFüllenAcrylatgele} /></li>
                </ul>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-home-grau/15 space-y-1">
                <span className="font-bold text-xs text-slate-900 block"><MdText text={inhalt.texte.mechanischeStrömungsbeziehungHagenPoiseu} /></span>
                <p className="text-[11px] text-text-main/85 leading-relaxed"><MdText text={inhalt.texte.dieFließgeschwindigkeitDesInjektionsharz} /></p>
              </div>

              <div className="border-t border-slate-100 pt-3">
                <span className="font-semibold text-xs text-slate-950 block mb-1.5"><MdText text={inhalt.texte.baustellenpraxisQualitätssicherung} /></span>
                <ol className="list-decimal pl-4 text-[11px] text-text-main/80 space-y-1">
                  <li><MdText text={inhalt.texte.packersetzungBohrpackerWerdenAbwechselnd} /></li>
                  <li><MdText text={inhalt.texte.verdämmungDerRissspaltIm} /></li>
                  <li><MdText text={inhalt.texte.verpressungVonUntenNach} /></li>
                </ol>
              </div>
            </div>
          </div>

          {/* 2. CARBONLAMELLEN */}
          <div className="bg-white p-5 rounded-xl border border-home-grau/25 space-y-4">
            <h4 className="font-bold text-sm text-shiraz flex items-center gap-2 border-b border-slate-100 pb-2">
              <Layers size={18} /><MdText text={inhalt.texte.tragwerksertüchtigungMitCarbonlamellenCf} /></h4>
            <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.einführungHöhererLastenOder} /></p>

            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-lg border border-home-grau/15 space-y-1.5">
                <span className="font-bold text-xs text-slate-900 block"><MdText text={inhalt.texte.klassifizierungAnwendungstechnologien} /></span>
                <ul className="text-[11px] text-text-main/95 space-y-2 leading-relaxed">
                  <li><MdText text={inhalt.texte.aufgeklebteLamellenAussenCfk} /></li>
                  <li><MdText text={inhalt.texte.inSchlitzeEingeklebteLamellen} /></li>
                </ul>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-home-grau/15 space-y-1">
                <span className="font-bold text-xs text-slate-900 block"><MdText text={inhalt.texte.bruchmechanischerGrenznachweisVerbundbru} /></span>
                <p className="text-[11px] text-text-main/85 leading-relaxed"><MdText text={inhalt.texte.dieHoheZugfestigkeitDes} /><div className="bg-white p-2 rounded border border-home-grau/15 text-center my-1">
                    <BlockMath math="F_{bd} = b_f \cdot \sqrt{2 \cdot E_f \cdot t_f \cdot G_{cbd}}" />
                  </div><MdText text={inhalt.texte.wobeiGCbdDie} /></p>
              </div>

              <div className="border-t border-slate-100 pt-3">
                <span className="font-semibold text-xs text-slate-950 block mb-1.5"><MdText text={inhalt.texte.brandschutzEinschränkung} /></span>
                <p className="text-[11px] text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.epoxidharzKlebstoffeSindHitzeempfindlich} /></p>
              </div>
            </div>
          </div>

        </div>

        {/* Didaktische Zusammenfassung */}
        <div className="p-3.5 bg-rose-50/40 border border-shiraz/20 rounded-xl text-xs text-slate-800 leading-relaxed">
          <span className="font-bold text-shiraz block"><MdText text={inhalt.texte.zusammenfassungFürDenBauingenieur} /></span><MdText text={inhalt.texte.dieKombinationAusRissinjektion} /></div>
      </div>
    </div>
  );
}
