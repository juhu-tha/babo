import { Scale, BookOpen, CheckCircle2 } from 'lucide-react';
import inhalt from '@/content/nachhaltigkeit/PraxisGebaeudetypE.json';
import { MdText } from '@/src/components/inhalt/MdText';

export default function PraxisGebaeudetypE() {
  return (
      <div className="space-y-6 animate-in fade-in duration-200">

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-home-grau/20 pb-3">
            <div>
              <h3 className="text-base font-extrabold text-slate-900"><MdText text={inhalt.texte.forschungsprojektEinfachBauenDas} /></h3>
              <p className="text-xs text-slate-500 mt-0.5"><MdText text={inhalt.texte.befreiungVonKomfortnormenZugunsten} /></p>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded bg-rose-50 text-shiraz border border-rose-200"><MdText text={inhalt.texte.kabinettsbeschlussNov2024} /></span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Left: Das juristische Problem und das Gebäudetyp-E-Vorhaben */}
            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Scale size={14} className="text-shiraz" /><MdText text={inhalt.texte.derAngestrebteJuristischeParadigmenwechs} /></h4>
              <p className="text-xs text-slate-700 leading-relaxed"><MdText text={inhalt.texte.bislangGaltImDeutschen} /></p>
              <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 leading-relaxed">
                <strong className="block font-bold text-amber-900 mb-1"><MdText text={inhalt.texte.kernDesGebäudetypE} /></strong><MdText text={inhalt.texte.derRegierungsentwurfVon2024} /><ul className="list-disc pl-4 mt-1.5 space-y-0.5 font-medium text-[11px]">
                  <li><MdText text={inhalt.texte.standsicherheitStatikTragfähigkeitNach} /></li>
                  <li><MdText text={inhalt.texte.brandschutzRettungswegeBrandwändeBaustof} /></li>
                  <li><MdText text={inhalt.texte.gesundheitsschutzPrimäreHygiene} /></li>
                  <li><MdText text={inhalt.texte.elementarerSchallUndWärmeschutz} /></li>
                </ul>
              </div>
            </div>

            {/* Right: Forschung "Einfach Bauen" TU München */}
            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen size={14} className="text-shiraz" /><MdText text={inhalt.texte.forschungshausBadAiblingTum} /></h4>
              <p className="text-xs text-slate-700 leading-relaxed"><MdText text={inhalt.texte.anDerTuMünchen} /></p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-1">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-center">
                  <strong className="text-xs font-bold text-slate-900 block">Monolithik</strong>
                  <span className="text-[10px] text-slate-500"><MdText text={inhalt.texte.verzichtAufMehrschichtVerbund} /></span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-center">
                  <strong className="text-xs font-bold text-slate-900 block"><MdText text={inhalt.texte.lowTechTga} /></strong>
                  <span className="text-[10px] text-slate-500"><MdText text={inhalt.texte.natürlicheFensterlüftungStattWartungsint} /></span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-center">
                  <strong className="text-xs font-bold text-slate-900 block">Speichermasse</strong>
                  <span className="text-[10px] text-slate-500"><MdText text={inhalt.texte.thermischeTrägheitPuffertTemperaturspitz} /></span>
                </div>
              </div>
            </div>

          </div>

          {/* Practical Savings Levers Table */}
          <div className="mt-4 pt-4 border-t border-home-grau/20">
            <h4 className="text-xs font-bold text-slate-900 mb-3 flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-600" /><MdText text={inhalt.texte.konkreteEinsparpotenzialeInPilotprojekte} /></h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-home-grau/25 rounded-xl overflow-hidden">
                <thead className="bg-slate-50 text-[11px] font-bold text-slate-700 uppercase">
                  <tr>
                    <th className="p-3 border-b border-home-grau/20"><MdText text={inhalt.texte.gewerkBauteil} /></th>
                    <th className="p-3 border-b border-home-grau/20"><MdText text={inhalt.texte.konventionellerKomfortstandard} /></th>
                    <th className="p-3 border-b border-home-grau/20"><MdText text={inhalt.texte.gebäudetypESuffizientePraxis} /></th>
                    <th className="p-3 border-b border-home-grau/20 text-emerald-800"><MdText text={inhalt.texte.ressourcenKosteneffekt} /></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-home-grau/20 text-[11px]">
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-3 font-bold text-slate-900">Deckenaufbauten</td>
                    <td className="p-3 text-slate-600"><MdText text={inhalt.texte.schwimmenderNassestrichAufTrittschalldäm} /></td>
                    <td className="p-3 text-slate-800"><MdText text={inhalt.texte.direktSichtbareHolzbalkendeckeOhne} /></td>
                    <td className="p-3 font-bold text-emerald-700"><MdText text={inhalt.texte.t4Bis6Wochen} /></td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-3 font-bold text-slate-900">Betondecken</td>
                    <td className="p-3 text-slate-600"><MdText text={inhalt.texte.t2224CmDicke} /></td>
                    <td className="p-3 text-slate-800"><MdText text={inhalt.texte.t1820CmStrikte} /></td>
                    <td className="p-3 font-bold text-emerald-700"><MdText text={inhalt.texte.t1520ZementUnd} /></td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-3 font-bold text-slate-900">Elektroinstallation</td>
                    <td className="p-3 text-slate-600"><MdText text={inhalt.texte.din18015Mindestanzahl4} /></td>
                    <td className="p-3 text-slate-800"><MdText text={inhalt.texte.nutzerangepassteSchlankeLeitungsführung} /></td>
                    <td className="p-3 font-bold text-emerald-700"><MdText text={inhalt.texte.t30WenigerKupferUnd} /></td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-3 font-bold text-slate-900"><MdText text={inhalt.texte.fensterFassade} /></td>
                    <td className="p-3 text-slate-600"><MdText text={inhalt.texte.elektrischGesteuerteRaffstoresMit} /></td>
                    <td className="p-3 text-slate-800"><MdText text={inhalt.texte.konstruktivVerschattendeVordächerUnd} /></td>
                    <td className="p-3 font-bold text-emerald-700"><MdText text={inhalt.texte.wartungsfreiNullAusfallrisiko100} /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    );
}
