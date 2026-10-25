// Ausgelagert aus src/modules/ki/KiUeberblick.tsx (AP 5.2)
import { CheckCircle2, AlertTriangle, ShieldAlert, TrendingUp, Check } from 'lucide-react';
import { InlineMath } from 'react-katex';
import inhalt from '@/content/ki/ueberblick/StandTab.json';
import { MdText } from '@/src/components/inhalt/MdText';

export default function StandTab() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 4 Praxisfelder */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-4">
        <h3 className="text-base font-bold text-text-main flex items-center gap-2">
          <TrendingUp className="text-shiraz" size={20} /><MdText text={inhalt.texte.woKiHeuteIn} /></h3>
        <p className="text-xs text-text-main/70"><MdText text={inhalt.texte.vierEtablierteEinsatzbereicheDie} /></p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 bg-off-white rounded-xl border border-home-grau/30 space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-shiraz/10 text-shiraz rounded-lg font-bold text-xs">01</span>
              <h4 className="font-bold text-sm text-text-main"><MdText text={inhalt.texte.materialRezepturoptimierung} /></h4>
            </div>
            <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.entwicklungKlinkerreduzierterZementeCem} /></p>
            <div className="text-[11px] text-slate-500 font-mono"><MdText text={inhalt.texte.nutzenSchnellereZulassungenBis} /></div>
          </div>

          <div className="p-4 bg-off-white rounded-xl border border-home-grau/30 space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-shiraz/10 text-shiraz rounded-lg font-bold text-xs">02</span>
              <h4 className="font-bold text-sm text-text-main"><MdText text={inhalt.texte.visuelleBauwerksdiagnoseDrohnen} /></h4>
            </div>
            <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.automatisierteSchadenserkennungNachDin} /></p>
            <div className="text-[11px] text-slate-500 font-mono"><MdText text={inhalt.texte.nutzen80ZeitersparnisBei} /></div>
          </div>

          <div className="p-4 bg-off-white rounded-xl border border-home-grau/30 space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-shiraz/10 text-shiraz rounded-lg font-bold text-xs">03</span>
              <h4 className="font-bold text-sm text-text-main"><MdText text={inhalt.texte.dokumentenAusschreibungsprüfung} /></h4>
            </div>
            <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.ragGestützteLlmsPrüfen} /></p>
            <div className="text-[11px] text-slate-500 font-mono"><MdText text={inhalt.texte.nutzenNachtragsrisikenDrastischReduziere} /></div>
          </div>

          <div className="p-4 bg-off-white rounded-xl border border-home-grau/30 space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-shiraz/10 text-shiraz rounded-lg font-bold text-xs">04</span>
              <h4 className="font-bold text-sm text-text-main"><MdText text={inhalt.texte.predictiveMaintenanceShmSensorik} /></h4>
            </div>
            <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.strukturierteSchwingungsanalyseAnBestehe} /></p>
            <div className="text-[11px] text-slate-500 font-mono"><MdText text={inhalt.texte.nutzenFrühwarnsystemZurEinsturzpräventio} /></div>
          </div>
        </div>
      </div>

      {/* Ehrliche Matrix: Was funktioniert vs. Was sind die Grenzen */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 space-y-4">
        <h3 className="text-base font-bold text-text-main flex items-center gap-2">
          <ShieldAlert className="text-amber-600" size={20} /><MdText text={inhalt.texte.reifegradCheckWasFunktioniert} /></h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-2.5">
            <h4 className="font-bold text-emerald-900 flex items-center gap-1.5">
              <CheckCircle2 size={16} className="text-emerald-700" /><MdText text={inhalt.texte.bereitsPraxistauglichVerlässlich} /></h4>
            <ul className="space-y-1.5 text-emerald-800 list-disc list-inside leading-snug">
              <li><MdText text={inhalt.texte.texterfassungStrukturierungZusammenfassu} /></li>
              <li><MdText text={inhalt.texte.codeAutomatisierungErstellungVon} /></li>
              <li><MdText text={inhalt.texte.bilderkennungAuffindenVonRissen} /></li>
              <li><MdText text={inhalt.texte.normenrechercheMitRagAuffinden} /></li>
              <li><MdText text={inhalt.texte.vorentwurfsvariantenGenerierenVielerGebä} /></li>
            </ul>
          </div>

          <div className="p-4 bg-rose-50/60 rounded-xl border border-rose-200 space-y-2.5">
            <h4 className="font-bold text-rose-900 flex items-center gap-1.5">
              <AlertTriangle size={16} className="text-rose-700" /><MdText text={inhalt.texte.aktuelleGrenzenNoGos} /></h4>
            <ul className="space-y-1.5 text-rose-800 list-disc list-inside leading-snug">
              <li><MdText text={inhalt.texte.keineUngeprüfteStatikEine} /></li>
              <li><MdText text={inhalt.texte.blackboxProblemNeuronaleNetze} /></li>
              <li><MdText text={inhalt.texte.halluzinationenBeiZahlenReines} /></li>
              <li><MdText text={inhalt.texte.datenschutzBetriebsgeheimnisKeineVertrau} /></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
