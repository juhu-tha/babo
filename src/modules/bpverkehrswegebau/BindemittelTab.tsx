import inhalt from '@/content/bpverkehrswegebau/BindemittelTab.json';
import { MdText } from '@/src/components/inhalt/MdText';
// Ausgelagert aus src/modules/BpVerkehrswegebau.tsx (AP 5.2)

export default function BindemittelTab() {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Bitumenprüfung & Kenngrößen */}
        <div className="bg-white p-5 rounded-xl border border-home-grau/30">
          <h3 className="font-bold text-text-main text-sm uppercase tracking-wider mb-3"><MdText text={inhalt.texte.straßenbaubitumenViskositätsklassen} /></h3>
          <p className="text-xs text-text-main/70 leading-relaxed mb-4"><MdText text={inhalt.texte.dasBindemittelBitumenIst} /></p>

          <div className="space-y-4">
            <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-lg text-xs">
              <p className="font-bold text-zinc-800"><MdText text={inhalt.texte.t1NadelpenetrationDinEn} /></p>
              <p className="text-text-main/75 mt-1"><MdText text={inhalt.texte.eineStandardisierteStahlnadel100g} /></p>
            </div>

            <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-lg text-xs">
              <p className="font-bold text-zinc-800"><MdText text={inhalt.texte.t2ErweichungspunktRingUnd} /></p>
              <p className="text-text-main/75 mt-1"><MdText text={inhalt.texte.temperaturBeiDerEine} /></p>
            </div>
          </div>
        </div>

        {/* Gesteinsprüfung: PSV-Wert */}
        <div className="bg-white p-5 rounded-xl border border-home-grau/30 flex flex-col justify-between">
          <h3 className="text-xl font-bold text-text-main flex items-center gap-2"><MdText text={inhalt.texte.polishingStoneValuePsv} /></h3>
  <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
    <p><MdText text={inhalt.texte.derWichtigsteMaterialParameter} /></p>

            <div className="bg-zinc-50 p-3.5 border border-zinc-200 rounded-lg text-xs space-y-2 mb-4">
              <p className="font-bold text-zinc-800">Verfahrensablauf:</p>
              <p className="text-[11px] leading-relaxed text-text-main/70"><MdText text={inhalt.texte.gesteinssplittKörnerWerdenAuf} /></p>
              <p className="font-bold text-[11px] text-zinc-900 border-t border-zinc-200 pt-2 font-mono"><MdText text={inhalt.texte.autobahndeckschichtenZwingendPsvWert} /></p>
  </div>

            <p className="text-xs text-text-main/75 leading-relaxed mb-2"><MdText text={inhalt.texte.geeigneteNaturgesteineFürExtremen} /></p>
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
              <span className="p-2 bg-zinc-100 text-zinc-700 rounded text-center"><MdText text={inhalt.texte.basaltAndesitDiabas} /></span>
              <span className="p-2 bg-red-50 text-red-900 border border-red-350 rounded text-center"><MdText text={inhalt.texte.keinWeicherKalkstein} /></span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
