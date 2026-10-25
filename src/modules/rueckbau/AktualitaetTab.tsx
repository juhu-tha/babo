import { Recycle, FileCheck, ShieldAlert } from 'lucide-react';
import inhalt from '@/content/rueckbau/AktualitaetTab.json';
import { MdText } from '@/src/components/inhalt/MdText';

export interface AktualitaetTabProps {

}

export function AktualitaetTab({  }: AktualitaetTabProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-home-grau/30 shadow-sm">
        <h3 className="text-base font-bold text-text-main mb-2"><MdText text={inhalt.texte.aktualisierungGesetzlicherStatus} /></h3>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.derAlteLfuLeitfaden} /></p>
        </div>
    
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Old vs New Mineral Recycling */}
          <div className="border border-shiraz/20 rounded-xl overflow-hidden shadow-sm">
            <div className="bg-shiraz/10 p-3 px-4 text-xs font-bold text-shiraz border-b border-shiraz/20 uppercase tracking-wider"><MdText text={inhalt.texte.mineralischeBauabfälleLagaM} /></div>
            <div className="p-4 space-y-4">
              <div className="bg-slate-50 p-2.5 rounded text-xs text-slate-600">
                <span className="font-bold text-slate-800 uppercase text-xs block"><MdText text={inhalt.texte.historischerZustandLagaM} /></span><MdText text={inhalt.texte.föderalismusFührteZuUneinheitlichen} /></div>
              
              <div className="bg-emerald-50 p-2.5 rounded text-xs text-emerald-800 border border-emerald-200">
                <span className="font-bold text-emerald-900 uppercase text-xs block"><MdText text={inhalt.texte.neuerZustandSeitAugust} /></span><MdText text={inhalt.texte.einführungEinerBundesweitHarmonisierten} /></div>
            </div>
          </div>
    
          {/* Card 2: GewAbfV and Circularity */}
          <div className="border border-indigo-200 rounded-xl overflow-hidden shadow-sm">
            <div className="bg-indigo-50 p-3 px-4 text-xs font-bold text-indigo-800 border-b border-indigo-200 uppercase tracking-wider"><MdText text={inhalt.texte.gewerbeabfallverordnungGewabfvGetrenntsa} /></div>
            <div className="p-4 space-y-4 text-xs text-text-main leading-relaxed">
              <div>
                <span className="font-bold text-slate-800 block"><MdText text={inhalt.texte.strengeGetrennthaltungsgebote} /></span><MdText text={inhalt.texte.dieGewabfvVerlangtDie} /></div>
              
              <div className="bg-indigo-50/50 p-3 rounded border border-indigo-100 space-y-2">
                <span className="font-bold text-indigo-900 block text-xs uppercase"><MdText text={inhalt.texte.gemische9Gewabfv} /></span><MdText text={inhalt.texte.eineFesteGetrenntsammlungsquoteFür} /></div>
    
              <div className="bg-white rounded border border-amber-300 p-2.5 text-xs text-amber-800"><MdText text={inhalt.texte.achtungBußgeldgefahrAusbleibendeGetrennt} /></div>
            </div>
          </div>
        </div>
      </div>
    
      {/* Table comparison representation */}
      <div className="bg-white p-6 rounded-xl border border-home-grau/30 shadow-sm overflow-x-auto">
        <h4 className="text-xs font-bold uppercase tracking-wider text-text-main/70 mb-3"><MdText text={inhalt.texte.rechtlicheKonsequenzenFürDie} /></h4>
        <table className="min-w-full text-xs text-left text-text-main">
          <thead className="bg-slate-50 uppercase text-xs text-text-main/60 border-b border-home-grau/30">
            <tr>
              <th className="py-3 px-4">Themenfeld</th>
              <th className="py-3 px-4"><MdText text={inhalt.texte.altePraxisLfuHistorisch} /></th>
              <th className="py-3 px-4"><MdText text={inhalt.texte.aktuelleVorschrift2026Ebv} /></th>
              <th className="py-3 px-4">Handlungsempfehlung</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-home-grau/15">
            <tr>
              <td className="py-3 px-4 font-bold"><MdText text={inhalt.texte.verwertungImErdbau} /></td>
              <td className="py-3 px-4"><MdText text={inhalt.texte.verwertungsLeitfadenBayernZ0} /></td>
              <td className="py-3 px-4 font-semibold text-emerald-800"><MdText text={inhalt.texte.ersatzbaustoffverordnungBm0Bis} /></td>
              <td className="py-3 px-4"><MdText text={inhalt.texte.nurChargenweiseImLabor} /></td>
            </tr>
            <tr>
              <td className="py-3 px-4 font-bold">Bauschutt-Transport</td>
              <td className="py-3 px-4"><MdText text={inhalt.texte.einfacheTransportbelegeInPapierform} /></td>
              <td className="py-3 px-4 font-semibold text-red-800"><MdText text={inhalt.texte.nachweisverfahrenElektronischEanv} /></td>
              <td className="py-3 px-4"><MdText text={inhalt.texte.fürAlleGefährlichenAbfälle} /></td>
            </tr>
            <tr>
              <td className="py-3 px-4 font-bold"><MdText text={inhalt.texte.wiederverwertungBeton} /></td>
              <td className="py-3 px-4"><MdText text={inhalt.texte.rcMaterialMeistIm} /></td>
              <td className="py-3 px-4 font-semibold text-emerald-800"><MdText text={inhalt.texte.kreislaufbetonRBetonNach} /></td>
              <td className="py-3 px-4"><MdText text={inhalt.texte.zerkleinerteGesteinskörnungImHochbau} /></td>
            </tr>
            <tr>
              <td className="py-3 px-4 font-bold">Rückbau-Konzepterstellung</td>
              <td className="py-3 px-4"><MdText text={inhalt.texte.optionalBeiKleinerenBauvorhaben} /></td>
              <td className="py-3 px-4 font-semibold text-amber-800"><MdText text={inhalt.texte.materialpasspflichtRessourcenpassVorbere} /></td>
              <td className="py-3 px-4"><MdText text={inhalt.texte.digitalisierungVonGebäudenMit} /></td>
            </tr>
          </tbody>
        </table>
      </div>
    
      {/* Neue Normengruppe: DIN SPEC 91525, DIN SPEC 91484, VDI 6210, DIN 18007 */}
      <div className="bg-white p-6 rounded-xl border border-home-grau/30 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-home-grau/20">
          <h4 className="text-base font-bold text-text-main flex items-center gap-2">
            <FileCheck size={18} className="text-shiraz" /><MdText text={inhalt.texte.aktuelleSchlüsselstandardsFürRückbau} /></h4>
          <span className="text-xs font-mono font-bold px-2.5 py-1 bg-shiraz/10 text-shiraz rounded-full border border-shiraz/20"><MdText text={inhalt.texte.normenstand20242026} /></span>
        </div>
        <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.fürEineRechtlichBelastbare} /></p>
    
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* DIN SPEC 91525 */}
          <div className="p-4 rounded-xl border border-home-grau/20 bg-off-white hover:border-shiraz/30 transition-all flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold px-2 py-0.5 bg-shiraz text-white rounded"><MdText text={inhalt.texte.dinSpec91525} /></span>
                <span className="text-[11px] text-slate-500 font-medium"><MdText text={inhalt.texte.anschlussnutzungskonzept202602} /></span>
              </div>
              <h5 className="font-bold text-sm text-text-main"><MdText text={inhalt.texte.anschlussnutzungskonzeptFürBauprodukteAu} /></h5>
              <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.beschreibtEinKonzeptPost} /></p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-home-grau/15 flex items-center justify-between text-[11px] text-text-main/70">
              <span><MdText text={inhalt.texte.fokusWiederverwendungAnschlussnutzung} /></span>
              <span className="font-mono font-bold text-shiraz"><MdText text={inhalt.texte.dinSpec915252026} /></span>
            </div>
          </div>
    
          {/* DIN SPEC 91484 */}
          <div className="p-4 rounded-xl border border-home-grau/20 bg-off-white hover:border-shiraz/30 transition-all flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold px-2 py-0.5 bg-shiraz text-white rounded"><MdText text={inhalt.texte.dinSpec91484} /></span>
                <span className="text-[11px] text-slate-500 font-medium"><MdText text={inhalt.texte.preDemolitionAudit} /></span>
              </div>
              <h5 className="font-bold text-sm text-text-main"><MdText text={inhalt.texte.erfassungVonBauproduktenVor} /></h5>
              <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.verfahrenZurErfassungVon} /></p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-home-grau/15 flex items-center justify-between text-[11px] text-text-main/70">
              <span><MdText text={inhalt.texte.fokusBauteilinventarWiederverwendungspot} /></span>
              <span className="font-mono font-bold text-shiraz"><MdText text={inhalt.texte.dinSpec914842023} /></span>
            </div>
          </div>
    
          {/* VDI 6210 */}
          <div className="p-4 rounded-xl border border-home-grau/20 bg-off-white hover:border-shiraz/30 transition-all flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold px-2 py-0.5 bg-slate-800 text-white rounded"><MdText text={inhalt.texte.vdi6210Blatt1} /></span>
                <span className="text-[11px] text-slate-500 font-medium"><MdText text={inhalt.texte.abbruchSchadstoffsanierung} /></span>
              </div>
              <h5 className="font-bold text-sm text-text-main"><MdText text={inhalt.texte.abbruchVonBaulichenUnd} /></h5>
              <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.regeltDieTechnischeDurchführung} /></p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-home-grau/15 flex items-center justify-between text-[11px] text-text-main/70">
              <span><MdText text={inhalt.texte.fokusAbbruchstatikEntkernungEmissionssch} /></span>
              <span className="font-mono font-bold text-slate-800"><MdText text={inhalt.texte.vdi6210Blatt12} /></span>
            </div>
          </div>
    
          {/* DIN 18007 */}
          <div className="p-4 rounded-xl border border-home-grau/20 bg-off-white hover:border-shiraz/30 transition-all flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold px-2 py-0.5 bg-slate-800 text-white rounded">
                  DIN 18007
                </span>
                <span className="text-[11px] text-slate-500 font-medium"><MdText text={inhalt.texte.abbrucharbeitenBegriffeVerfahren} /></span>
              </div>
              <h5 className="font-bold text-sm text-text-main"><MdText text={inhalt.texte.abbrucharbeitenBegriffeVerfahrenAnwendun} /></h5>
              <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.dieÜbergeordneteNationaleGrundnorm} /></p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-home-grau/15 flex items-center justify-between text-[11px] text-text-main/70">
              <span><MdText text={inhalt.texte.fokusAbbruchverfahrenBegriffsdefinitione} /></span>
              <span className="font-mono font-bold text-slate-800"><MdText text={inhalt.texte.din18007202209} /></span>
            </div>
          </div>
        </div>
      </div>
    
      {/* Detailliertes Fachmodul: Ersatzbaustoffverordnung (EBV) & GefStoffV 2024/2026 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* EBV Systematik */}
        <div className="bg-white p-6 rounded-xl border border-home-grau/30 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-home-grau/20">
            <h4 className="text-sm font-bold text-text-main flex items-center gap-2">
              <Recycle size={18} className="text-shiraz" /><MdText text={inhalt.texte.ersatzbaustoffverordnungEbvMaterialklass} /></h4>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded border border-emerald-200"><MdText text={inhalt.texte.seit01082023} /></span>
          </div>
          <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.dieEbvHarmonisiertDas} /></p>
          <div className="space-y-2 text-xs">
            <div className="p-3 bg-off-white rounded-lg border border-home-grau/15">
              <strong className="text-shiraz block mb-1"><MdText text={inhalt.texte.recyclingBaustoffeRc1} /></strong>
              <ul className="list-disc list-inside space-y-0.5 text-text-main/80 text-[11px]">
                <li><MdText text={inhalt.texte.rc1HöchsteGüteklasse} /></li>
                <li><MdText text={inhalt.texte.rc2MittlereBelastung} /></li>
                <li><MdText text={inhalt.texte.rc3StarkEingeschränkter} /></li>
              </ul>
            </div>
            <div className="p-3 bg-off-white rounded-lg border border-home-grau/15">
              <strong className="text-slate-800 block mb-1"><MdText text={inhalt.texte.bodenmaterialBmGleisschotterGs} /></strong>
              <p className="text-[11px] text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.klassenBm0Unbelasteter} /></p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-[11px] text-slate-700 font-mono"><MdText text={inhalt.texte.güteüberwachungNachEbvEignungsnachweis} /></div>
          </div>
        </div>
    
        {/* GefStoffV & TRGS 519 Ampelmodell */}
        <div className="bg-white p-6 rounded-xl border border-home-grau/30 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-home-grau/20">
            <h4 className="text-sm font-bold text-text-main flex items-center gap-2">
              <ShieldAlert size={18} className="text-shiraz" /><MdText text={inhalt.texte.gefstoffvNovelleTrgs519} /></h4>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-red-50 text-red-800 rounded border border-red-200"><MdText text={inhalt.texte.gefstoffvSeit0512} /></span>
          </div>
          <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.dieNovellierteGefahrstoffverordnungGefst} /></p>
          <div className="space-y-2 text-xs">
            <div className="p-3 bg-red-50/40 rounded-lg border border-red-200 space-y-1">
              <strong className="text-red-900 block text-xs"><MdText text={inhalt.texte.informationspflichtDesVeranlassers5a} /></strong>
              <p className="text-[11px] text-red-950/80 leading-relaxed"><MdText text={inhalt.texte.vorBeginnDerArbeiten} /></p>
            </div>
            <div className="p-3 bg-off-white rounded-lg border border-home-grau/15 space-y-1.5">
              <strong className="text-text-main block text-xs"><MdText text={inhalt.texte.risikobasiertesMaßnahmenkonzeptGefstoffv} /></strong>
              <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-bold">
                <div className="p-2 rounded bg-emerald-100 text-emerald-900 border border-emerald-300"><MdText text={inhalt.texte.grün10000F} /><span className="font-normal block text-[9.5px] mt-0.5 text-emerald-800"><MdText text={inhalt.texte.niedrigesRisikoZB} /></span>
                </div>
                <div className="p-2 rounded bg-amber-100 text-amber-900 border border-amber-300"><MdText text={inhalt.texte.gelb10000100} /><span className="font-normal block text-[9.5px] mt-0.5 text-amber-800"><MdText text={inhalt.texte.mittleresRisikoGenehmigungBei} /></span>
                </div>
                <div className="p-2 rounded bg-red-100 text-red-900 border border-red-300"><MdText text={inhalt.texte.rot100000F} /><span className="font-normal block text-[9.5px] mt-0.5 text-red-800"><MdText text={inhalt.texte.hohesRisikoZulassungSchwarz} /></span>
                </div>
              </div>
              <p className="text-[11px] text-text-main/70 leading-relaxed pt-1"><MdText text={inhalt.texte.bauenImBestandErfordert} /></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
