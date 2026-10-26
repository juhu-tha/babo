import { CheckCircle2 } from 'lucide-react';
import { InlineMath } from 'react-katex';
import inhalt from '@/content/mechanischekenngroessen/Beispiele.json';
import { MdText } from '@/src/components/inhalt/MdText';

export default function Beispiele() {
  return (
      <div className="space-y-6 animate-in fade-in duration-300">

        {/* Beispiel 1: Stahlbau Zugstab */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-3 pb-2 border-b border-home-grau/20">
            <h3 className="font-bold text-base text-text-main flex items-center gap-2">
              <CheckCircle2 className="text-emerald-600" size={18} /><MdText text={inhalt.texte.beispiel1ZugstabIm} /></h3>
            <span className="text-xs font-mono bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded border border-emerald-200"><MdText text={inhalt.texte.stahlbauS235} /></span>
          </div>

          <div className="text-xs text-text-main/80 space-y-3 leading-relaxed">
            <p><MdText text={inhalt.texte.aufgabenstellungEinRundstahlZugstab} /></p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-2">
              <div className="p-3 bg-off-white rounded-xl border border-home-grau/20 space-y-1.5 font-mono text-[11px]">
                <div className="font-bold text-text-main font-sans"><MdText text={inhalt.texte.t1QuerschnittDehnsteifigkeitSpannung} /></div>
                <div><MdText text={inhalt.texte.a030Mm4} /></div>
                <div><MdText text={inhalt.texte.ea210000N} /></div>
                <div><MdText text={inhalt.texte.fA0120000} /></div>
                <div className="text-emerald-700"><MdText text={inhalt.texte.nachweis1698Mpa} /></div>
              </div>

              <div className="p-3 bg-off-white rounded-xl border border-home-grau/20 space-y-1.5 font-mono text-[11px]">
                <div className="font-bold text-text-main font-sans"><MdText text={inhalt.texte.t2DehnungVerformungen} /></div>
                <div><MdText text={inhalt.texte.e16976210} /></div>
                <div><MdText text={inhalt.texte.lFL0Ea} /></div>
                <div><MdText text={inhalt.texte.q0300} /></div>
                <div><MdText text={inhalt.texte.dQD00} /></div>
              </div>
            </div>
          </div>
        </div>

        {/* Beispiel 2: Biegesteifigkeit eines Einfeldträgers */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-3 pb-2 border-b border-home-grau/20">
            <h3 className="font-bold text-base text-text-main flex items-center gap-2">
              <CheckCircle2 className="text-indigo-600" size={18} /><MdText text={inhalt.texte.beispiel2BiegesteifigkeitEi} /></h3>
            <span className="text-xs font-mono bg-indigo-50 text-indigo-800 px-2.5 py-0.5 rounded border border-indigo-200"><MdText text={inhalt.texte.holzbauC24DinEn} /></span>
          </div>

          <div className="text-xs text-text-main/80 space-y-3 leading-relaxed">
            <p><MdText text={inhalt.texte.aufgabenstellungEinDeckenbalkenAus} /></p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-2">
              <div className="p-3 bg-off-white rounded-xl border border-home-grau/20 space-y-1.5 font-mono text-[11px]">
                <div className="font-bold text-text-main font-sans"><MdText text={inhalt.texte.t1FlächenträgheitsmomentBiegesteifigkeit} /></div>
                <div><MdText text={inhalt.texte.iy120Mm240} /></div>
                <div><MdText text={inhalt.texte.eiy11000N} /></div>
                <div><MdText text={inhalt.texte.eiy15206} /></div>
              </div>

              <div className="p-3 bg-off-white rounded-xl border border-home-grau/20 space-y-1.5 font-mono text-[11px]">
                <div className="font-bold text-text-main font-sans"><MdText text={inhalt.texte.t2DurchbiegungEinzellastFeldmitte} /></div>
                <div><MdText text={inhalt.texte.wMaxFL} /></div>
                <div><MdText text={inhalt.texte.wMax15000} /></div>
                <div><MdText text={inhalt.texte.wMax1875} /></div>
                <div className="text-indigo-800"><MdText text={inhalt.texte.vergleichMitDemEmpfehlungswert} /></div>
              </div>
            </div>
          </div>
        </div>

        {/* Beispiel 3: Massivbau Betonstütze mit Kriecheffekt */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-3 pb-2 border-b border-home-grau/20">
            <h3 className="font-bold text-base text-text-main flex items-center gap-2">
              <CheckCircle2 className="text-blue-600" size={18} /><MdText text={inhalt.texte.beispiel3StauchungEiner} /></h3>
            <span className="text-xs font-mono bg-blue-50 text-blue-800 px-2.5 py-0.5 rounded border border-blue-200"><MdText text={inhalt.texte.massivbauC3037} /></span>
          </div>

          <div className="text-xs text-text-main/80 space-y-3 leading-relaxed">
            <p><MdText text={inhalt.texte.aufgabenstellungEineQuadratischeStahlbet} /></p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-2">
              <div className="p-3 bg-off-white rounded-xl border border-home-grau/20 space-y-1.5 font-mono text-[11px]">
                <div className="font-bold text-text-main font-sans"><MdText text={inhalt.texte.t1SpannungSofortverformung} /></div>
                <div><MdText text={inhalt.texte.a400Mm400} /></div>
                <div><MdText text={inhalt.texte.t1200000N} /></div>
                <div><MdText text={inhalt.texte.t075033} /></div>
                <div><MdText text={inhalt.texte.l003500} /></div>
              </div>

              <div className="p-3 bg-off-white rounded-xl border border-home-grau/20 space-y-1.5 font-mono text-[11px]">
                <div className="font-bold text-text-main font-sans"><MdText text={inhalt.texte.t2LangzeitverformungMitKriechzahl} /></div>
                <div><MdText text={inhalt.texte.eCEffE} /></div>
                <div><MdText text={inhalt.texte.end75011} /></div>
                <div><MdText text={inhalt.texte.lEndEnd3500} /></div>
                <div className="text-blue-700"><MdText text={inhalt.texte.kriechanteilAlleinLKriechen} /></div>
              </div>
            </div>
          </div>
        </div>

        {/* Beispiel 4: Spannbeton Relaxation */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-3 pb-2 border-b border-home-grau/20">
            <h3 className="font-bold text-base text-text-main flex items-center gap-2">
              <CheckCircle2 className="text-purple-600" size={18} /><MdText text={inhalt.texte.beispiel4SpannkraftverlustDurch} /></h3>
            <span className="text-xs font-mono bg-purple-50 text-purple-800 px-2.5 py-0.5 rounded border border-purple-200"><MdText text={inhalt.texte.spannbetonY1860} /></span>
          </div>

          <div className="text-xs text-text-main/80 space-y-3 leading-relaxed">
            <p><MdText text={inhalt.texte.aufgabenstellungEinSpannstahlY1860} /></p>

            <div className="p-3 bg-off-white rounded-xl border border-home-grau/20 space-y-1.5 font-mono text-[11px]">
              <div><MdText text={inhalt.texte.ausnutzungsgradP0FPk} /></div>
              <div><MdText text={inhalt.texte.relaxationsverlustNachEurocode2} /></div>
              <div><MdText text={inhalt.texte.prP0066} /></div>
              <div><MdText text={inhalt.texte.prP00662} /></div>
              <div><MdText text={inhalt.texte.spannungsverlustNach1000H} /></div>
              <div><MdText text={inhalt.texte.verbleibendeVorspannungP1000h} /></div>
            </div>
          </div>
        </div>

      </div>
    );
}
