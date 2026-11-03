import React, { useState } from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { 
  Scale, FileCheck, ShieldCheck, Factory, FileSignature, Leaf, 
  Award, HelpCircle, CheckCircle2, ClipboardCheck, Check, Globe,
  BookOpen, Users, Layers, Activity, FileText
} from 'lucide-react';
import { useTabContext } from '@/src/contexts/TabContext';
import inhalt from '@/content/bprechtliches/BpRechtliches.json';
import { MdText } from '@/src/components/inhalt/MdText';

interface BpRechtlichesProps {
  isEmbedded?: boolean;
  activeSubTab?: 'grundlagen' | 'avcp' | 'begriffe' | 'normenarbeit';
}

export default function BpRechtliches({ isEmbedded = false, activeSubTab: activeSubTabProp }: BpRechtlichesProps) {
  const [localActiveSubTab, setLocalActiveSubTab] = useState<'grundlagen' | 'avcp' | 'begriffe' | 'normenarbeit'>('grundlagen');
  const { setActiveTab } = useTabContext();

  const activeSubTab = activeSubTabProp || localActiveSubTab;
  const isDirectTab = !!activeSubTabProp;

  const subTabMetadata = {
    grundlagen: {
      title: inhalt.werte.ceVsÜZeichen,
      subtitle: inhalt.werte.rechtlicheGrundlagenZulassungen,
      desc: inhalt.werte.musterbauordnungMboLandesbauordnungenLbo,
      icon: Scale
    },
    avcp: {
      title: inhalt.werte.avcpSystemeÜberwachung,
      subtitle: inhalt.werte.dieFünfBewertungsUnd,
      desc: inhalt.werte.systematikUndTrägerDer,
      icon: ShieldCheck
    },
    begriffe: {
      title: inhalt.werte.konformitätsbewertungAuditierung,
      subtitle: inhalt.werte.dieBegrifflichenSäulenDes,
      desc: inhalt.werte.präziseJuristischeUndTechnische,
      icon: Award
    },
    normenarbeit: {
      title: inhalt.werte.normenarbeitImBauwesen,
      subtitle: inhalt.werte.strukturenDesNationalenUnd,
      desc: inhalt.werte.organisationsebenenIsoCenDin,
      icon: BookOpen
    }
  };

  const meta = subTabMetadata[activeSubTab];
  const MetaIcon = meta.icon;

  return (
    <div className={isEmbedded ? "flex flex-col gap-6" : "flex flex-col gap-8"}>
      <div className={isEmbedded ? "" : "bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30"}>
        {!isEmbedded && isDirectTab && (
          <div className="flex flex-col gap-4 mb-6 border-b border-home-grau/30 pb-6">
            <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <MetaIcon className="text-indigo-600 animate-pulse" size={24} /> {meta.title}
        </h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            <strong className="text-stone-700 font-semibold">{meta.subtitle}:</strong> {meta.desc}
          </p>
        </div>
          </div>
        )}

        {!isEmbedded && !isDirectTab && (
          <>
            <div className="flex flex-col gap-4 mb-6 border-b border-home-grau/30 pb-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-text-main flex items-center gap-2 animate-in slide-in-from-left duration-200">
                    <Scale className="text-indigo-600" /><MdText text={inhalt.texte.bauprodukteRechtlicheGrundlagenZulassung} /></h2>
                </div>
              </div>
              <p className="text-xs text-text-main/70"><MdText text={inhalt.texte.juristischeRegelwerkeEuropäischeUnd} /></p>
            </div>

            {/* High-End Grid-Based Button Sub-Navigation like Schadstoffe */}
            <div className="p-4 bg-slate-50 border border-home-grau/30 rounded-2xl mb-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { id: 'grundlagen' as const, label: inhalt.werte.ceVsÜZeichen2, sub: inhalt.werte.inverkehrbringenVerwendbarkeit, icon: Scale },
                  { id: 'avcp' as const, label: 'AVCP-Systeme', sub: inhalt.werte.die5StufenDer, icon: ShieldCheck },
                  { id: 'begriffe' as const, label: 'Konformitätsbewertung', sub: inhalt.werte.akkreditierungBisVerifizierung, icon: Award },
                  { id: 'normenarbeit' as const, label: inhalt.werte.normenarbeitImBauwesen2, sub: inhalt.werte.ebenenTrägerAufgaben, icon: BookOpen }
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeSubTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setLocalActiveSubTab(tab.id)}
                      className={`p-4 rounded-xl border transition-all duration-200 flex flex-col items-start gap-1.5 text-left h-full cursor-pointer group ${
                        isActive 
                          ? 'bg-shiraz border-shiraz text-white shadow-md' 
                          : 'bg-white border-home-grau/30 hover:bg-off-white text-slate-700 hover:shadow-sm'
                      }`}
                    >
                      <div className={`p-1.5 rounded-lg ${isActive ? 'bg-white/15 text-white' : 'bg-shiraz/10 text-shiraz group-hover:bg-shiraz/20 transition-colors'}`}>
                        <Icon size={18} />
                      </div>
                      <span className={`text-xs font-bold leading-tight mt-1 ${isActive ? 'text-white' : 'text-slate-900'}`}>
                        {tab.label}
                      </span>
                      <span className={`text-[10px] leading-tight ${isActive ? 'text-white/80' : 'text-slate-500'}`}>
                        {tab.sub}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Base Info Banner */}
            <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mb-6">
              <p><MdText text={inhalt.texte.bauprodukteDürfenInDeutschland} /></p>
            </div>
          </>
        )}

        {/* Sub-Tab 1: EU vs. National */}
        {activeSubTab === 'grundlagen' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            
            {/* Rechtsstand-Box BauPVO */}
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-xs text-amber-950 flex items-start gap-2.5">
              <Scale className="text-amber-800 shrink-0 mt-0.5" size={16} />
              <div><MdText text={inhalt.texte.rechtsstandSeit0801} /></div>
            </div>

            {/* Split View: EU vs National Base Documents */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Europäischer Rahmen */}
              <div className="space-y-4">
                <h3 className="text-base font-bold text-indigo-900 flex items-center gap-2 pb-2 border-b border-home-grau/10">
                  <FileSignature className="w-5 h-5 text-indigo-600" /><MdText text={inhalt.texte.europäischerRahmenBaupvoCe} /></h3>
                
                <div className="bg-stone-50 p-4 rounded-xl border border-home-grau/30 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-3 opacity-5"><Scale size={48} /></div>
                  <h4 className="font-bold text-indigo-800 text-sm mb-2 relative z-10"><MdText text={inhalt.texte.dieBauproduktenverordnungBaupvo} /></h4>
                  <p className="text-xs text-gray-700 relative z-10 mb-2 leading-relaxed"><MdText text={inhalt.texte.dieBauproduktenverordnungVerordnungEu} /></p>
                </div>

                <div className="bg-stone-50 p-4 rounded-xl border border-home-grau/30 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-3 opacity-5"><FileCheck size={48} /></div>
                  <h4 className="font-bold text-indigo-800 text-sm mb-2 relative z-10"><MdText text={inhalt.texte.leistungserklärungDopCeKennzeichnung} /></h4>
                  <ul className="list-disc pl-5 space-y-2 text-xs text-gray-700 relative z-10">
                    <li><MdText text={inhalt.texte.henHarmonisierteEuropäischeNorm} /></li>
                    <li><MdText text={inhalt.texte.leistungserklärungDopDeclarationOf} /></li>
                    <li><MdText text={inhalt.texte.ceKennzeichenBestätigtDas} /><span className="text-red-750 font-semibold">Wichtig:</span><MdText text={inhalt.texte.dasCeZeichenIst} /></li>
                    <li><MdText text={inhalt.texte.etaEuropeanTechnicalAssessment} /></li>
                  </ul>
                </div>
              </div>

              {/* Nationaler Rahmen */}
              <div className="space-y-4">
                <h3 className="text-base font-bold text-indigo-900 flex items-center gap-2 pb-2 border-b border-home-grau/10">
                  <ShieldCheck className="w-5 h-5 text-indigo-600" /><MdText text={inhalt.texte.nationalerSektorBrauchbarkeitDibt} /></h3>
                
                <div className="bg-stone-50 p-4 rounded-xl border border-home-grau/30 text-xs text-text-main/80 space-y-3">
                  <p className="leading-relaxed"><MdText text={inhalt.texte.fälltEinBauproduktNicht} /></p>

                  <div className="space-y-3 pt-2">
                    <div className="p-3 bg-white rounded-lg border border-home-grau/10">
                      <p className="font-bold text-indigo-950 text-xs"><MdText text={inhalt.texte.abzAbgAllgemeineBauaufsichtliche} /></p>
                      <p className="text-[11px] text-text-main/70 mt-1"><MdText text={inhalt.texte.ausgestelltDurchDasDibt} /></p>
                    </div>

                    <div className="p-3 bg-white rounded-lg border border-home-grau/10">
                      <p className="font-bold text-indigo-950 text-xs"><MdText text={inhalt.texte.abpAllgemeinesBauaufsichtlichesPrüfzeugn} /></p>
                      <p className="text-[11px] text-text-main/70 mt-1"><MdText text={inhalt.texte.fürProdukteBauartenMit} /></p>
                    </div>

                    <div className="p-3 bg-white rounded-lg border border-home-grau/10">
                      <p className="font-bold text-indigo-950 text-xs"><MdText text={inhalt.texte.zieVbgZustimmungIm} /></p>
                      <p className="text-[11px] text-text-main/70 mt-1"><MdText text={inhalt.texte.erteiltDurchDieOberste} /></p>
                    </div>

                    <div className="p-3 bg-white rounded-lg border border-home-grau/10">
                      <p className="font-bold text-indigo-950 text-xs"><MdText text={inhalt.texte.üZeichenÜbereinstimmungszeichen} /></p>
                      <p className="text-[11px] text-text-main/70 mt-1"><MdText text={inhalt.texte.bestätigtDassDasProdukt} /></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* NEU: Paradigmenwechsel - MVV TB statt Bauregellisten */}
            <div className="bg-slate-50 border border-home-grau/30 p-5 rounded-2xl space-y-4 shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg border border-indigo-100">
                  <Scale className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-text-main"><MdText text={inhalt.texte.systemwechselInDeutschlandMvv} /></h4>
                  <span className="text-[10px] text-indigo-600 font-mono block"><MdText text={inhalt.texte.rechtsprechungUndHistorischerParadigmenw} /></span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed text-text-main/80">
                <div className="space-y-3">
                  <p>
                    <strong className="text-slate-900"><MdText text={inhalt.texte.dieHistorischeRolleDer} /></strong><MdText text={inhalt.texte.bisZumJahr2017} /></p>
                  <p>
                    <strong className="text-slate-900"><MdText text={inhalt.texte.dasFolgenschwereEughUrteil} /></strong><MdText text={inhalt.texte.imOktober2014Entschied} /><span className="text-rose-600 font-bold underline"><MdText text={inhalt.texte.keineZusätzlichenProduktprüfungen} /></span><MdText text={inhalt.texte.oderNationaleZeichenWie} /></p>
                </div>
                <div className="space-y-3">
                  <p>
                    <strong className="text-slate-900"><MdText text={inhalt.texte.dieGeburtsstundeDerMvv} /></strong><MdText text={inhalt.texte.umDeutscheBrandschutzUnd} /></p>
                  <div className="bg-white border border-home-grau/30 p-3 rounded-xl space-y-1.5 shadow-sm">
                    <p className="text-[11px] font-bold text-indigo-900 flex items-center gap-1">
                      <Check size={14} className="text-emerald-600" /><MdText text={inhalt.texte.regulierungDesBauwerksStatt} /></p>
                    <p className="text-[10.5px] text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.daDasBauproduktSelbst} /></p>
                    <p className="text-[10.5px] text-text-main/70 leading-relaxed"><MdText text={inhalt.texte.derPlanerArchitektSteht} /></p>
                  </div>
                </div>
              </div>
            </div>

            {/* NEU: Systematische Abgrenzung CE-Kennzeichnung vs. Ü-Zeichen */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2 pb-2 border-b border-home-grau/10">
                <Layers className="w-5 h-5 text-indigo-600" /><MdText text={inhalt.texte.systematischeAbgrenzungCeKennzeichnung} /></h3>

              <div className="bg-white rounded-xl border border-home-grau/30 shadow-sm overflow-hidden text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200">
                  {/* CE-Kennzeichnung links */}
                  <div className="p-5 space-y-3 bg-indigo-50/10">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-indigo-950 flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span><MdText text={inhalt.texte.europäischHarmonisiertCeKennzeichnung} /></h4>
                      <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 font-bold text-[9px] uppercase tracking-wider rounded"><MdText text={inhalt.texte.musterBaupvo} /></span>
                    </div>

                    <div className="space-y-1.5 text-slate-700 text-[11px] leading-relaxed">
                      <p><MdText text={inhalt.texte.schnittstelleGiltZwingendFür} /></p>
                      <p><MdText text={inhalt.texte.dasRechtlicheKernstückDop} /></p>
                      <p className="bg-amber-50 text-amber-900 p-2.5 rounded-lg border border-amber-200">
                        <span className="font-bold"><MdText text={inhalt.texte.keinPauschalesGütesiegel} /></span><MdText text={inhalt.texte.einCeZeichenSagt} /></p>
                      <p><MdText text={inhalt.texte.doppelzulassungZusätzlicheNationaleÜ} /><span className="font-semibold text-rose-600">rechtswidrig</span><MdText text={inhalt.texte.undVerboten} /></p>
                    </div>
                  </div>

                  {/* Ü-Zeichen rechts */}
                  <div className="p-5 space-y-3 bg-emerald-50/10">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-emerald-950 flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span><MdText text={inhalt.texte.nationalGeregeltÜbereinstimmungszeichenÜ} /></h4>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[9px] uppercase tracking-wider rounded"><MdText text={inhalt.texte.mvvTbLbo} /></span>
                    </div>

                    <div className="space-y-1.5 text-slate-700 text-[11px] leading-relaxed">
                      <p><MdText text={inhalt.texte.schnittstelleGiltAusschließlichIm} /></p>
                      <p><MdText text={inhalt.texte.brauchbarkeitsnachweisVoraussetzungFürDa} /><em className="text-slate-800">abZ</em><MdText text={inhalt.texte.oderEinPrüfzeugnis} /><em className="text-slate-800">abP</em>).
                      </p>
                      <p className="bg-emerald-50 text-emerald-900 p-2.5 rounded-lg border border-emerald-200">
                        <span className="font-bold">Konformitätsversprechen:</span><MdText text={inhalt.texte.dasÜZeichenBestätigt} /></p>
                      <p><MdText text={inhalt.texte.verantwortungDasProduktBringt} /></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Green Deal & Future */}
            <div className="bg-slate-50 p-5 rounded-xl border border-home-grau/30 mt-2">
              <h3 className="font-bold text-indigo-900 text-md mb-2 flex items-center gap-1.5">
                <Leaf size={18} className="text-emerald-600" /><MdText text={inhalt.texte.baupvo20243110Digitaler} /></h3>
              <p className="text-xs text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.mitDemInkrafttretenDer} /></p>
            </div>
          </div>
        )}

        {/* Sub-Tab 2: AVCP-Systeme zur Leistungsüberwachung */}
        {activeSubTab === 'avcp' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 text-sm">
              <h3 className="font-bold text-indigo-900 mb-1 flex items-center gap-1.5Packed">
                <Factory size={18} className="text-indigo-600" /><MdText text={inhalt.texte.avcpSystemeAssessmentAnd} /></h3>
              <p className="text-text-main/80 text-xs leading-relaxed"><MdText text={inhalt.texte.umSicherzustellenDassNicht} /></p>
            </div>

            {/* AVCP Comparison Matrix Table */}
            <div className="bg-white rounded-xl border border-home-grau/30 shadow-sm overflow-hidden">
              <div className="p-4 bg-slate-50 border-b border-home-grau/30">
                <h4 className="font-bold text-sm text-text-main"><MdText text={inhalt.texte.aufgabenteilungImRahmenDer} /></h4>
              </div>
              <div className="overflow-x-auto text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100/50 border-b border-home-grau/30 text-text-main">
                      <th className="p-3 font-bold w-[12%]">System</th>
                      <th className="p-3 font-bold w-[15%]">Sicherheitsrelevanz</th>
                      <th className="p-3 font-bold w-[30%]"><MdText text={inhalt.texte.aufgabenDesHerstellersEigenüberwachung} /></th>
                      <th className="p-3 font-bold w-[33%]"><MdText text={inhalt.texte.aufgabenDerNotifiziertenStelle} /></th>
                      <th className="p-3 font-bold w-[10%]">Beispiele</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-home-grau/10 text-text-main/80">
                    {/* System 1+ */}
                    <tr className="hover:bg-indigo-50/10">
                      <td className="p-3 font-bold text-indigo-700">System 1+</td>
                      <td className="p-3 font-semibold text-red-700">Extrem hoch</td>
                      <td className="p-3">
                        <ul className="list-disc pl-3 space-y-1">
                          <li><MdText text={inhalt.texte.werkseigeneProduktionskontrolleWpk} /></li>
                          <li><MdText text={inhalt.texte.prüfungVonImWerk} /></li>
                        </ul>
                      </td>
                      <td className="p-3 text-slate-700">
                        <ul className="list-disc pl-3 space-y-1">
                          <li className="font-semibold text-indigo-900"><MdText text={inhalt.texte.bestimmungDesProdukttypsErstprüfung} /></li>
                          <li><MdText text={inhalt.texte.erstinspektionDesWerkesUnd} /></li>
                          <li><MdText text={inhalt.texte.laufendeÜberwachungBewertungUnd} /></li>
                          <li className="font-semibold text-emerald-800"><MdText text={inhalt.texte.stichprobenprüfungVonVorDem} /></li>
                        </ul>
                      </td>
                      <td className="p-3 italic"><MdText text={inhalt.texte.normalzementDinEn197} /></td>
                    </tr>

                    {/* System 1 */}
                    <tr className="hover:bg-indigo-50/10">
                      <td className="p-3 font-bold text-indigo-700">System 1</td>
                      <td className="p-3 font-semibold text-red-600">Sehr hoch</td>
                      <td className="p-3">
                        <ul className="list-disc pl-3 space-y-1">
                          <li><MdText text={inhalt.texte.wpkImHerstellerwerk} /></li>
                          <li><MdText text={inhalt.texte.prüfungVonProbenNach} /></li>
                        </ul>
                      </td>
                      <td className="p-3 text-slate-700">
                        <ul className="list-disc pl-3 space-y-1">
                          <li><MdText text={inhalt.texte.bestimmungDesProdukttypsErstprüfung2} /></li>
                          <li><MdText text={inhalt.texte.erstinspektionDesWerkesUnd2} /></li>
                          <li><MdText text={inhalt.texte.laufendeÜberwachungBewertungUnd2} /></li>
                          <li className="list-none text-home-grau text-[10px] block font-medium"><MdText text={inhalt.texte.keinAuditTestingDer} /></li>
                        </ul>
                      </td>
                      <td className="p-3 italic"><MdText text={inhalt.texte.rauchwarnmelderFeuerschutzabschlüsseTrag} /></td>
                    </tr>

                    {/* System 2+ */}
                    <tr className="hover:bg-indigo-50/10 bg-emerald-50/10">
                      <td className="p-3 font-bold text-indigo-700">System 2+</td>
                      <td className="p-3 font-semibold text-amber-600"><MdText text={inhalt.texte.hochStandardTragwerk} /></td>
                      <td className="p-3">
                        <ul className="list-disc pl-3 space-y-1">
                          <li className="font-semibold text-indigo-800"><MdText text={inhalt.texte.bestimmungDesProdukttypsEigen} /></li>
                          <li>WPK im Werk</li>
                          <li><MdText text={inhalt.texte.prüfungVonProbenNach2} /></li>
                        </ul>
                      </td>
                      <td className="p-3 text-slate-700">
                        <ul className="list-disc pl-3 space-y-1">
                          <li className="font-semibold text-indigo-900"><MdText text={inhalt.texte.erstinspektionDesWerkesUnd3} /></li>
                          <li className="font-semibold text-indigo-900"><MdText text={inhalt.texte.laufendeÜberwachungDerWpk} /></li>
                          <li className="list-none text-xs text-emerald-800 font-semibold"><MdText text={inhalt.texte.stelleZertifiziertAusschließlichDie} /></li>
                        </ul>
                      </td>
                      <td className="p-3 italic"><MdText text={inhalt.texte.mauersteineKatIGesteinskörnungen} /></td>
                    </tr>

                    {/* System 3 */}
                    <tr className="hover:bg-indigo-50/10">
                      <td className="p-3 font-bold text-indigo-700">System 3</td>
                      <td className="p-3 font-semibold text-indigo-600">Mittel</td>
                      <td className="p-3">
                        <ul className="list-disc pl-3 space-y-1">
                          <li>WPK im Werk</li>
                        </ul>
                      </td>
                      <td className="p-3 text-slate-700">
                        <ul className="list-disc pl-3 space-y-1">
                          <li className="font-semibold text-indigo-900"><MdText text={inhalt.texte.bestimmungDesProdukttypsErstprüfung3} /></li>
                          <li className="list-none text-home-grau text-[10px] block"><MdText text={inhalt.texte.keineInspektionDesWerks} /></li>
                        </ul>
                      </td>
                      <td className="p-3 italic"><MdText text={inhalt.texte.wärmedämmstoffeGipsplattenInnenputzeDach} /></td>
                    </tr>

                    {/* System 3+ (Neu BauPVO 2024/3110) */}
                    <tr className="hover:bg-indigo-50/10 bg-emerald-50/20">
                      <td className="p-3 font-bold text-emerald-800">
                        System 3+
                        <span className="text-[9px] block text-emerald-600 font-normal"><MdText text={inhalt.texte.neuBaupvoEu2024} /></span>
                      </td>
                      <td className="p-3 font-semibold text-emerald-700"><MdText text={inhalt.texte.umweltNachhaltigkeit} /></td>
                      <td className="p-3">
                        <ul className="list-disc pl-3 space-y-1">
                          <li>WPK im Werk</li>
                          <li><MdText text={inhalt.texte.ermittlungBerechnungDerUmweltmerkmale} /></li>
                        </ul>
                      </td>
                      <td className="p-3 text-slate-700">
                        <ul className="list-disc pl-3 space-y-1">
                          <li className="font-semibold text-emerald-900"><MdText text={inhalt.texte.bewertungDerUmweltUnd} /></li>
                          <li className="list-none text-home-grau text-[10px] block"><MdText text={inhalt.texte.überprüfungDerUmweltmerkmaleIn} /></li>
                        </ul>
                      </td>
                      <td className="p-3 italic"><MdText text={inhalt.texte.umweltmerkmaleGwpÖkobilanzIn} /></td>
                    </tr>

                    {/* System 4 */}
                    <tr className="hover:bg-indigo-50/10">
                      <td className="p-3 font-bold text-indigo-700">System 4</td>
                      <td className="p-3 font-semibold text-slate-600"><MdText text={inhalt.texte.geringHerstellerselbstdeklaration} /></td>
                      <td className="p-3">
                        <ul className="list-disc pl-3 space-y-1">
                          <li className="font-bold text-indigo-800"><MdText text={inhalt.texte.bestimmungDesProdukttypsErstprüfung4} /></li>
                          <li><MdText text={inhalt.texte.wpkImWerkSelbst} /></li>
                        </ul>
                      </td>
                      <td className="p-3 text-slate-50 font-bold bg-slate-50 text-center text-home-grau flex items-center justify-center p-3 h-full"><MdText text={inhalt.texte.keineNotifizierteStelleErforderlich} /></td>
                      <td className="p-3 italic"><MdText text={inhalt.texte.badezimmerkeramikSanitärLeichteVerkleidu} /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="p-3 bg-amber-50 border-t border-amber-200 text-xs text-amber-950"><MdText text={inhalt.texte.wichtigerHinweisZuBeton} /></div>
            </div>

            {/* In-depth AVCP Roles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-stone-50 rounded-xl border border-home-grau/30 text-xs">
                <h4 className="font-bold text-indigo-900 mb-2 flex items-center gap-1">
                  <span className="p-1 bg-indigo-100 text-indigo-700 rounded">1</span><MdText text={inhalt.texte.rolleDesHerstellersIn} /></h4>
                <p className="mb-2 leading-relaxed"><MdText text={inhalt.texte.dieWpkWerkseigeneProduktionskontrolle} /></p>
              </div>

              <div className="p-4 bg-stone-50 rounded-xl border border-home-grau/30 text-xs">
                <h4 className="font-bold text-indigo-900 mb-2 flex items-center gap-1">
                  <span className="p-1 bg-indigo-100 text-indigo-700 rounded">2</span><MdText text={inhalt.texte.rolleDerNotifiziertenStelle} /></h4>
                <p className="mb-2 leading-relaxed"><MdText text={inhalt.texte.abSystem3Wird} /></p>
              </div>
            </div>
          </div>
        )}

        {/* Sub-Tab 3: Begriffe der Konformitätsbewertung */}
        {activeSubTab === 'begriffe' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="bg-amber-50/40 p-4 rounded-xl border border-amber-200 text-sm">
              <h3 className="font-bold text-amber-900 mb-1 flex items-center gap-1.5">
                <Award size={18} className="text-amber-700" /><MdText text={inhalt.texte.dieBegrifflichenSäulenDer} /></h3>
              <p className="text-text-main/80 text-xs leading-relaxed"><MdText text={inhalt.texte.imBauproduktenUndVergaberecht} /></p>
            </div>

            {/* Description Grid cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Akkreditierung */}
              <div className="border border-home-grau/30 rounded-xl p-5 bg-white shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 font-bold text-[10px] rounded uppercase">Säule 1</span>
                    <h4 className="font-bold text-text-main text-base"><MdText text={inhalt.texte.akkreditierungAccreditation} /></h4>
                  </div>
                  <p className="text-xs text-text-main/70 leading-relaxed mb-3"><MdText text={inhalt.texte.dieAkkreditierungIstDie} /></p>
                  <p className="text-xs text-text-main/80 bg-slate-50 p-2 rounded border border-home-grau/10"><MdText text={inhalt.texte.rechtlicheBasisEuVerordnung} /></p>
                </div>
                <div className="mt-4 pt-3 border-t border-home-grau/10 flex items-center justify-between text-[11px] text-indigo-700 font-medium">
                  <span><MdText text={inhalt.texte.beispielDakksAkkreditiertMpa} /></span>
                  <Award size={14} />
                </div>
              </div>

              {/* Notifizierung */}
              <div className="border border-home-grau/30 rounded-xl p-5 bg-white shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 font-bold text-[10px] rounded uppercase">Säule 2</span>
                    <h4 className="font-bold text-text-main text-base"><MdText text={inhalt.texte.notifizierungNotification} /></h4>
                  </div>
                  <p className="text-xs text-text-main/70 leading-relaxed mb-3"><MdText text={inhalt.texte.dieNotifizierungIstDer} /></p>
                  <p className="text-xs text-text-main/80 bg-slate-50 p-2 rounded border border-home-grau/10"><MdText text={inhalt.texte.behördlicheZuständigkeitDerMitgliedstaat} /></p>
                </div>
                <div className="mt-4 pt-3 border-t border-home-grau/10 flex items-center justify-between text-[11px] text-indigo-700 font-medium">
                  <span><MdText text={inhalt.texte.beispielDibtNotifiziertPrüf} /></span>
                  <Globe className="text-emerald-700" size={14} />
                </div>
              </div>

              {/* Zertifizierung */}
              <div className="border border-home-grau/30 rounded-xl p-5 bg-white shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 font-bold text-[10px] rounded uppercase">Säule 3</span>
                    <h4 className="font-bold text-text-main text-base"><MdText text={inhalt.texte.zertifizierungCertification} /></h4>
                  </div>
                  <p className="text-xs text-text-main/70 leading-relaxed mb-3"><MdText text={inhalt.texte.dieZertifizierungIstDas} /></p>
                  <div className="space-y-1 text-xs text-text-main/80 bg-slate-50 p-2 rounded border border-home-grau/10">
                    <p><MdText text={inhalt.texte.produktzertifizierungBestätigtEigenschaf} /></p>
                    <p><MdText text={inhalt.texte.systemzertifizierungBestätigtDasVorliege} /></p>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-home-grau/10 flex items-center justify-between text-[11px] text-indigo-700 font-medium">
                  <span><MdText text={inhalt.texte.beispielAusstellungEinesZertifikats} /></span>
                  <ClipboardCheck className="text-blue-700" size={14} />
                </div>
              </div>

              {/* Verifizierung */}
              <div className="border border-home-grau/30 rounded-xl p-5 bg-white shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-1 bg-amber-100 text-amber-700 font-bold text-[10px] rounded uppercase">Säule 4</span>
                    <h4 className="font-bold text-text-main text-base"><MdText text={inhalt.texte.verifizierungVerification} /></h4>
                  </div>
                  <p className="text-xs text-text-main/70 leading-relaxed mb-3"><MdText text={inhalt.texte.dieVerifizierungIstDer} /></p>
                  <p className="text-xs text-text-main/80 bg-slate-50 p-2 rounded border border-home-grau/10"><MdText text={inhalt.texte.schnittstelleBauwesenEinZentraler} /></p>
                </div>
                <div className="mt-4 pt-3 border-t border-home-grau/10 flex items-center justify-between text-[11px] text-indigo-700 font-medium">
                  <span><MdText text={inhalt.texte.beispielEinUnabhängigerVerifizierer} /></span>
                  <CheckCircle2 className="text-amber-700" size={14} />
                </div>
              </div>

              {/* Auditierung */}
              <div className="border border-home-grau/30 rounded-xl p-5 bg-white shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-1 bg-rose-100 text-rose-700 font-bold text-[10px] rounded uppercase">Säule 5</span>
                    <h4 className="font-bold text-text-main text-base"><MdText text={inhalt.texte.auditierungAuditing} /></h4>
                  </div>
                  <p className="text-xs text-text-main/70 leading-relaxed mb-3"><MdText text={inhalt.texte.dieAuditierungIstDas} /></p>
                  <p className="text-xs text-text-main/80 bg-slate-50 p-2 rounded border border-home-grau/10"><MdText text={inhalt.texte.fremdüberwachungEinQualifizierterFremdüb} /></p>
                </div>
                <div className="mt-4 pt-3 border-t border-home-grau/10 flex items-center justify-between text-[11px] text-rose-700 font-medium">
                  <span><MdText text={inhalt.texte.beispielEinAuditorAuditiert} /></span>
                  <FileText className="text-rose-700" size={14} />
                </div>
              </div>

            </div>

            {/* Visual Flow summary */}
            <div className="border border-indigo-100 bg-indigo-50/20 rounded-xl p-5 flex flex-col justify-between">
              <h4 className="font-bold text-xs text-indigo-900 mb-2 uppercase tracking-wide"><MdText text={inhalt.texte.derAblaufEinesBauprodukt} /></h4>
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 text-xs">
                <div className="flex-1 bg-white border border-home-grau/30 p-3 rounded-lg">
                  <span className="font-bold text-indigo-700 block mb-1"><MdText text={inhalt.texte.schritt1Kompetenznachweis} /></span><MdText text={inhalt.texte.kompetenznachweisDibtPrüfungGgf} /></div>
                <div className="hidden md:block text-home-grau font-bold text-lg">➔</div>
                <div className="flex-1 bg-white border border-home-grau/30 p-3 rounded-lg">
                  <span className="font-bold text-indigo-700 block mb-1"><MdText text={inhalt.texte.schritt2Notifizierung} /></span><MdText text={inhalt.texte.derMitgliedstaatMeldetDie} /></div>
                <div className="hidden md:block text-home-grau font-bold text-lg">➔</div>
                <div className="flex-1 bg-white border border-home-grau/30 p-3 rounded-lg">
                  <span className="font-bold text-indigo-700 block mb-1"><MdText text={inhalt.texte.schritt3Auditierung} /></span><MdText text={inhalt.texte.unabhängigeAuditorenÜberprüfenDie} /></div>
                <div className="hidden md:block text-home-grau font-bold text-lg">➔</div>
                <div className="flex-1 bg-white border border-home-grau/30 p-3 rounded-lg">
                  <span className="font-bold text-indigo-700 block mb-1"><MdText text={inhalt.texte.schritt4ZertifizierungVerifizierung} /></span><MdText text={inhalt.texte.dieZertifizierungsstelleBewertetDas} /></div>
              </div>
            </div>
          </div>
        )}

        {/* Sub-Tab 4: Normenarbeit (Struktur & Aufgaben) */}
        {activeSubTab === 'normenarbeit' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            {/* Intro Header */}
            <div className="bg-shiraz/5 text-text-main p-5 rounded-xl shadow-sm border border-shiraz/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-700 font-mono text-[10px] uppercase rounded border border-indigo-400/20"><MdText text={inhalt.texte.anerkannteRegelnDerTechnik} /></span>
                <h3 className="font-bold text-lg text-text-main flex items-center gap-2">
                  <BookOpen size={20} className="text-indigo-700" /><MdText text={inhalt.texte.technischeNormenarbeitImBauwesen} /></h3>
                <p className="text-xs text-slate-700 leading-relaxed max-w-3xl"><MdText text={inhalt.texte.normenSindKeineGesetze} /></p>
              </div>
            </div>

            {/* Structure Section */}
            <div>
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2 pb-2 border-b border-home-grau/10 mb-4">
                <Layers className="w-5 h-5 text-indigo-600" /><MdText text={inhalt.texte.t1DieStrukturDer} /></h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* National: DIN */}
                <div className="bg-slate-50 border border-home-grau/30 rounded-xl p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-200/60 px-2 py-0.5 rounded uppercase font-mono">National</span>
                      <span className="font-bold text-xs text-indigo-600">Deutschland</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm mb-1.5">DIN e. V.</h4>
                    <span className="text-[11px] text-slate-500 block mb-2 italic"><MdText text={inhalt.texte.deutschesInstitutFürNormung} /></span>
                    <p className="text-xs text-slate-700 leading-relaxed"><MdText text={inhalt.texte.erstelltNationaleDinNormen} /></p>
                    <ul className="text-[11px] text-slate-600 space-y-1.5 mt-3 pl-3 list-disc">
                      <li><MdText text={inhalt.texte.spiegelausschüsseBegleitenDieEuropäische} /></li>
                      <li><MdText text={inhalt.texte.konsensprinzipBeteiligungAllerInteressie} /></li>
                    </ul>
                  </div>
                  <div className="mt-4 pt-3 border-t border-home-grau/30 text-[10px] text-slate-500 flex items-center gap-1.5">
                    <Activity size={12} className="text-slate-400" />
                    <span><MdText text={inhalt.texte.sitzInBerlinGegründet} /></span>
                  </div>
                </div>

                {/* European: CEN */}
                <div className="bg-indigo-50/20 border border-indigo-100 rounded-xl p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-bold text-indigo-600 bg-indigo-100/50 px-2 py-0.5 rounded uppercase font-mono">Europäisch</span>
                      <span className="font-bold text-xs text-indigo-600">Binnenmarkt</span>
                    </div>
                    <h4 className="font-bold text-indigo-900 text-sm mb-1.5">CEN</h4>
                    <span className="text-[11px] text-indigo-700/80 block mb-2 italic"><MdText text={inhalt.texte.europeanCommitteeForStandardization} /></span>
                    <p className="text-xs text-indigo-950/80 leading-relaxed"><MdText text={inhalt.texte.erstelltHarmonisierteEuropäischeNormen} /></p>
                    <ul className="text-[11px] text-indigo-900/70 space-y-1.5 mt-3 pl-3 list-disc">
                      <li><MdText text={inhalt.texte.übernahmepflichtJedeEnNorm} /></li>
                      <li><MdText text={inhalt.texte.rückzugspflichtEntgegengesetzteNationale} /></li>
                    </ul>
                  </div>
                  <div className="mt-4 pt-3 border-t border-indigo-100/60 text-[10px] text-indigo-700/80 flex items-center gap-1.5">
                    <Globe size={12} className="text-indigo-400" />
                    <span><MdText text={inhalt.texte.t34EuropäischeMitgliedsländer} /></span>
                  </div>
                </div>

                {/* International: ISO */}
                <div className="bg-slate-50 border border-home-grau/30 rounded-xl p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-200/60 px-2 py-0.5 rounded uppercase font-mono">Global</span>
                      <span className="font-bold text-xs text-indigo-600">Weltweit</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm mb-1.5">ISO</h4>
                    <span className="text-[11px] text-slate-500 block mb-2 italic"><MdText text={inhalt.texte.internationalOrganizationForStandardizat} /></span>
                    <p className="text-xs text-slate-700 leading-relaxed"><MdText text={inhalt.texte.etabliertWeltweiteStandardsZ} /></p>
                    <ul className="text-[11px] text-slate-600 space-y-1.5 mt-3 pl-3 list-disc">
                      <li><MdText text={inhalt.texte.wienerVereinbarungVertraglichGeregelte} /></li>
                      <li><MdText text={inhalt.texte.globaleBilanzenImmerWichtiger} /></li>
                    </ul>
                  </div>
                  <div className="mt-4 pt-3 border-t border-home-grau/30 text-[10px] text-slate-500 flex items-center gap-1.5">
                    <Activity size={12} className="text-slate-400" />
                    <span><MdText text={inhalt.texte.hauptsitzInGenfSchweiz} /></span>
                  </div>
                </div>
              </div>

              {/* Wiener Vereinbarung Detail Callout */}
              <div className="bg-slate-100 border border-home-grau/30 p-3 rounded-xl mt-3 text-xs text-slate-700 leading-relaxed">
                <span className="font-bold text-slate-900"><MdText text={inhalt.texte.dieWienerVereinbarungVienna} /></span><MdText text={inhalt.texte.stelltSicherDassNormen} /></div>
            </div>

            {/* Core Tasks Section */}
            <div>
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2 pb-2 border-b border-home-grau/10 mb-4">
                <ClipboardCheck className="w-5 h-5 text-indigo-600" /><MdText text={inhalt.texte.t2DieKernaufgabenDer} /></h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                {/* Task 1 */}
                <div className="border border-home-grau/30 p-4 rounded-xl bg-white space-y-1.5">
                  <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg w-fit">
                    <Users size={16} />
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs">Konsensbildung</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed"><MdText text={inhalt.texte.normenEntstehenNichtIm} /></p>
                </div>

                {/* Task 2 */}
                <div className="border border-home-grau/30 p-4 rounded-xl bg-white space-y-1.5">
                  <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg w-fit">
                    <ShieldCheck size={16} />
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs"><MdText text={inhalt.texte.sicherheitsGesundheitsschutz} /></h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed"><MdText text={inhalt.texte.definitionVonMindestanforderungenUnd} /></p>
                </div>

                {/* Task 3 */}
                <div className="border border-home-grau/30 p-4 rounded-xl bg-white space-y-1.5">
                  <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg w-fit">
                    <Scale size={16} />
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs">Marktharmonisierung</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed"><MdText text={inhalt.texte.durchsetzungEinerEuropaweitEinheitlichen} /></p>
                </div>

                {/* Task 4 */}
                <div className="border border-home-grau/30 p-4 rounded-xl bg-white space-y-1.5">
                  <div className="p-1.5 bg-purple-50 text-purple-600 rounded-lg w-fit">
                    <Leaf size={16} />
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs"><MdText text={inhalt.texte.förderungDerKreislaufwirtschaft} /></h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed"><MdText text={inhalt.texte.integrationNeuartigerRecyclingMaterialie} /></p>
                </div>
              </div>
            </div>

            {/* Workflow Process "Der Weg zur Norm" */}
            <div>
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2 pb-2 border-b border-home-grau/10 mb-4">
                <FileText className="w-5 h-5 text-indigo-600" /><MdText text={inhalt.texte.t3DerStrukturierteAblauf} /></h3>

              <div className="relative border-l border-indigo-100 pl-4 ml-3 space-y-6 text-xs">
                {/* Step 1 */}
                <div className="relative">
                  <div className="absolute -left-[21px] top-0.5 w-[13px] h-[13px] rounded-full bg-indigo-600 border-2 border-white"></div>
                  <div className="font-bold text-indigo-900 flex items-center gap-2">
                    <span className="font-mono text-[10px] bg-indigo-100 px-1.5 py-0.5 rounded text-indigo-700">Phase 1</span><MdText text={inhalt.texte.initiativphaseProjektvorschlagStandardiz} /></div>
                  <p className="text-slate-600 text-[11px] mt-1 leading-relaxed"><MdText text={inhalt.texte.einNormungsantragKannVon} /></p>
                </div>

                {/* Step 2 */}
                <div className="relative">
                  <div className="absolute -left-[21px] top-0.5 w-[13px] h-[13px] rounded-full bg-indigo-600 border-2 border-white"></div>
                  <div className="font-bold text-indigo-900 flex items-center gap-2">
                    <span className="font-mono text-[10px] bg-indigo-100 px-1.5 py-0.5 rounded text-indigo-700">Phase 2</span><MdText text={inhalt.texte.ausarbeitungsphaseArbeitsentwurf} /></div>
                  <p className="text-slate-600 text-[11px] mt-1 leading-relaxed"><MdText text={inhalt.texte.einExpertengremiumImZuständigen} /></p>
                </div>

                {/* Step 3 */}
                <div className="relative">
                  <div className="absolute -left-[21px] top-0.5 w-[13px] h-[13px] rounded-full bg-indigo-600 border-2 border-white"></div>
                  <div className="font-bold text-indigo-900 flex items-center gap-2">
                    <span className="font-mono text-[10px] bg-indigo-100 px-1.5 py-0.5 rounded text-indigo-700">Phase 3</span><MdText text={inhalt.texte.entwurfsphaseStellungnahmeverfahrenÖffen} /></div>
                  <p className="text-slate-600 text-[11px] mt-1 leading-relaxed"><MdText text={inhalt.texte.derNormEntwurfZ} /></p>
                </div>

                {/* Step 4 */}
                <div className="relative">
                  <div className="absolute -left-[21px] top-0.5 w-[13px] h-[13px] rounded-full bg-indigo-600 border-2 border-white"></div>
                  <div className="font-bold text-indigo-900 flex items-center gap-2">
                    <span className="font-mono text-[10px] bg-indigo-100 px-1.5 py-0.5 rounded text-indigo-700">Phase 4</span><MdText text={inhalt.texte.schlichtungsphaseKonsensprüfung} /></div>
                  <p className="text-slate-600 text-[11px] mt-1 leading-relaxed"><MdText text={inhalt.texte.derZuständigeArbeitsausschussBeurteilt} /></p>
                </div>

                {/* Step 5 */}
                <div className="relative">
                  <div className="absolute -left-[21px] top-0.5 w-[13px] h-[13px] rounded-full bg-indigo-600 border-2 border-white"></div>
                  <div className="font-bold text-indigo-900 flex items-center gap-2">
                    <span className="font-mono text-[10px] bg-indigo-100 px-1.5 py-0.5 rounded text-indigo-700">Phase 5</span><MdText text={inhalt.texte.publikationWeißdruck} /></div>
                  <p className="text-slate-600 text-[11px] mt-1 leading-relaxed"><MdText text={inhalt.texte.nachGenehmigungNationalBzw} /></p>
                </div>

                {/* Step 6 */}
                <div className="relative">
                  <div className="absolute -left-[21px] top-0.5 w-[13px] h-[13px] rounded-full bg-emerald-600 border-2 border-white"></div>
                  <div className="font-bold text-emerald-800 flex items-center gap-2">
                    <span className="font-mono text-[10px] bg-emerald-100 px-1.5 py-0.5 rounded text-emerald-700">Phase 6</span><MdText text={inhalt.texte.baurechtlicheEinführungStatus} /></div>
                  <p className="text-slate-600 text-[11px] mt-1 leading-relaxed"><MdText text={inhalt.texte.eineVeröffentlichteDinNorm} /></p>
                </div>
              </div>
            </div>

            {/* Informative Grid Callout about legal binding of standards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-xs space-y-1">
                <h5 className="font-bold text-amber-900 flex items-center gap-1">
                  <Scale size={14} className="text-amber-700" /><MdText text={inhalt.texte.müssenNormenImmerEingehalten} /></h5>
                <p className="text-amber-950/80 leading-relaxed text-[11px]"><MdText text={inhalt.texte.rechtlichGesehenHandeltEs} /></p>
              </div>

              <div className="bg-indigo-50/40 border border-indigo-100 p-4 rounded-xl text-xs space-y-1">
                <h5 className="font-bold text-indigo-900 flex items-center gap-1">
                  <HelpCircle size={14} className="text-indigo-700" /><MdText text={inhalt.texte.wieOftWerdenNormen} /></h5>
                <p className="text-indigo-950/80 leading-relaxed text-[11px]"><MdText text={inhalt.texte.normenUnterliegenDerRegelmäßigen} /></p>
              </div>
            </div>
          </div>
        )}

      </div>
      
      {!isEmbedded && <ModulTest moduleId="bp_recht" />}

      {!isEmbedded && activeSubTab === 'normenarbeit' && (
        <ModuleFooter 
          wikipedia={[
            { title: inhalt.werte.deutschesInstitutFürNormung, url: "https://de.wikipedia.org/wiki/Deutsches_Institut_f%C3%BCr_Normung" },
            { title: inhalt.werte.europäischesKomiteeFürNormung, url: "https://de.wikipedia.org/wiki/Europ%C3%A4isches_Komitee_f%C3%BCr_Normung" },
            { title: inhalt.werte.internationaleOrganisationFürNormung, url: "https://de.wikipedia.org/wiki/Internationale_Organisation_f%C3%BCr_Normung" },
            { title: inhalt.werte.standDerTechnik, url: "https://de.wikipedia.org/wiki/Stand_der_Technik" }
          ]} 
          literatur={inhalt.daten["BpRechtliches.literatur"]} 
          regelwerke={inhalt.daten["BpRechtliches.regelwerke"]} 
          formeln={[]} 
        />
      )}

      {!isEmbedded && activeSubTab !== 'normenarbeit' && (
        <ModuleFooter 
          wikipedia={[
            { title: "Bauproduktenverordnung", url: "https://de.wikipedia.org/wiki/Verordnung_(EU)_Nr._305/2011" },
            { title: "CE-Kennzeichnung", url: "https://de.wikipedia.org/wiki/CE-Kennzeichnung" },
            { title: inhalt.werte.akkreditierungRecht },
            { title: inhalt.werte.europäischeTechnischeBewertungEta, url: "https://de.wikipedia.org/wiki/Europ%C3%A4ische_Technische_Zulassung" }
          ]} 
          literatur={inhalt.daten["BpRechtliches.literatur_2"]} 
          regelwerke={inhalt.daten["BpRechtliches.regelwerke_2"]} 
          formeln={inhalt.daten["BpRechtliches.formeln"]} 
        />
      )}
    </div>
  );
}
