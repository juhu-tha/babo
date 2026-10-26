// Ausgelagert aus src/modules/ki/KiUeberblick.tsx (AP 5.2)
import { Clock } from 'lucide-react';
import inhalt from '@/content/ki/ueberblick/HistorieTab.json';
import { MdText } from '@/src/components/inhalt/MdText';

export default function HistorieTab() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-6 animate-in fade-in duration-300">
      <div className="space-y-1">
        <h3 className="text-base font-bold text-text-main flex items-center gap-2">
          <Clock className="text-shiraz" size={20} /><MdText text={inhalt.texte.dieEvolutionDerBau} /></h3>
        <p className="text-xs text-text-main/70"><MdText text={inhalt.texte.derWegDerBauingenieure} /></p>
      </div>

      <div className="relative border-l-2 border-shiraz/30 ml-3 md:ml-4 space-y-8 pl-5 md:pl-7 pt-2">
        {/* Phase 1 */}
        <div className="relative space-y-1.5">
          <div className="absolute -left-[27px] md:-left-[35px] top-0 w-5 h-5 rounded-full bg-white border-4 border-shiraz shadow-sm" />
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-shiraz bg-shiraz/10 px-2 py-0.5 rounded"><MdText text={inhalt.texte.t1960er1980er} /></span>
            <h4 className="font-bold text-sm text-text-main"><MdText text={inhalt.texte.dieAnfängeStatischeRechenprogramme} /></h4>
          </div>
          <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.einführungVonGroßrechnernUnd} /></p>
          <div className="text-[11px] text-text-main/60 bg-off-white p-2 rounded-lg border border-home-grau/20"><MdText text={inhalt.texte.meilensteinErsteCadSysteme} /></div>
        </div>

        {/* Phase 2 */}
        <div className="relative space-y-1.5">
          <div className="absolute -left-[27px] md:-left-[35px] top-0 w-5 h-5 rounded-full bg-white border-4 border-slate-400 shadow-sm" />
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded"><MdText text={inhalt.texte.t1990er2000er} /></span>
            <h4 className="font-bold text-sm text-text-main"><MdText text={inhalt.texte.ersteNeuronaleNetzeGenetische} /></h4>
          </div>
          <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.ersteAkademischeVersucheMit} /></p>
          <div className="text-[11px] text-text-main/60 bg-off-white p-2 rounded-lg border border-home-grau/20"><MdText text={inhalt.texte.grenzeDamalsGeringeRechenleistung} /></div>
        </div>

        {/* Phase 3 */}
        <div className="relative space-y-1.5">
          <div className="absolute -left-[27px] md:-left-[35px] top-0 w-5 h-5 rounded-full bg-white border-4 border-slate-400 shadow-sm" />
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">2010 – 2020</span>
            <h4 className="font-bold text-sm text-text-main"><MdText text={inhalt.texte.bimReifeDrohnenComputer} /></h4>
          </div>
          <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.derWeltweiteDurchbruchVon} /></p>
          <div className="text-[11px] text-text-main/60 bg-off-white p-2 rounded-lg border border-home-grau/20"><MdText text={inhalt.texte.meilensteinAutomatisierteBaufortschritts} /></div>
        </div>

        {/* Phase 4 */}
        <div className="relative space-y-1.5">
          <div className="absolute -left-[27px] md:-left-[35px] top-0 w-5 h-5 rounded-full bg-white border-4 border-shiraz shadow-sm" />
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-shiraz bg-shiraz/10 px-2 py-0.5 rounded">2022 – 2024</span>
            <h4 className="font-bold text-sm text-text-main"><MdText text={inhalt.texte.dieGenerativeKiRevolution} /></h4>
          </div>
          <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.mitChatgptClaudeUnd} /></p>
          <div className="text-[11px] text-text-main/60 bg-off-white p-2 rounded-lg border border-home-grau/20"><MdText text={inhalt.texte.paradigmenwechselSoftwareentwicklungWird} /></div>
        </div>

        {/* Phase 5 */}
        <div className="relative space-y-1.5">
          <div className="absolute -left-[27px] md:-left-[35px] top-0 w-5 h-5 rounded-full bg-emerald-500 border-4 border-emerald-100 shadow-sm" />
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">Ab 2025</span>
            <h4 className="font-bold text-sm text-text-main"><MdText text={inhalt.texte.autonomeWorkflowsPinnsAgenten} /></h4>
          </div>
          <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.derÜbergangVonReinen} /></p>
        </div>
      </div>
    </div>
  );
}
