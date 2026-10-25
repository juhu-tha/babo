import React from 'react';
import { 
  BookOpen, 
  Calculator, 
  Lightbulb, 
  Layers, 
  Activity, 
  ShieldCheck, 
  Database, 
  Check 
} from 'lucide-react';
import { InlineMath } from 'react-katex';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import inhalt from '@/content/anleitung/Anleitung.json';
import { MdText } from '@/src/components/inhalt/MdText';

export default function Anleitung() {
  return (
    <div className="flex flex-col gap-8 w-full mt-4">
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-8">
        
        {/* HEADER */}
        <div className="flex items-center gap-4 border-b border-home-grau/20 pb-6">
          <div className="w-16 h-16 bg-shiraz/10 rounded-2xl flex items-center justify-center text-shiraz shrink-0">
            <BookOpen size={32} />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-text-main"><MdText text={inhalt.texte.anleitungKonzept} /></h2>
            <p className="text-base sm:text-lg text-text-main/70 mt-1"><MdText text={inhalt.texte.kompakteAktuelleInformationsquelleUnd} /></p>
          </div>
        </div>

        {/* INTRO-BOX: DIE ZWEI LEITMÖGLICHKEITEN DES BAUSTOFFBOARDS */}
        <div className="bg-shiraz/5 border border-shiraz/20 p-6 rounded-xl text-left w-full space-y-3">
          <div className="flex items-start gap-3.5">
            <Lightbulb className="text-shiraz shrink-0 mt-1" size={26} />
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-shiraz mb-1.5"><MdText text={inhalt.texte.dasLeitkonzeptFundierteWissensbasis} /></h3>
              <p className="text-text-main/80 leading-relaxed text-sm">
                Das <strong>BaustoffBoard</strong> vereint zwei zentrale Aufgabenbereiche für Studium, Labor, Gutachterwesen und Tragwerksplanung: 
                Es fungiert als <strong><MdText text={inhalt.texte.kompakteVerlässlicheUndStets} /></strong> zu allen baustoffkundlichen und bauchemischen Fragestellungen 
                (unter strikter Einhaltung der aktuellen Normengeneration wie DIN 1045-2:2023-08, DIN EN 197-1/5, Eurocode 2) und bietet gleichzeitig die 
                <strong><MdText text={inhalt.texte.unmittelbareInteraktiveAnwendungDimensio} /></strong>.
              </p>
            </div>
          </div>
        </div>

        {/* DIE 2 SÄULEN DER PLATTFORM */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Säule 1 */}
          <div className="p-6 rounded-2xl border border-home-grau/30 bg-off-white flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2.5 text-shiraz font-bold text-base">
                <Database size={20} />
                <span><MdText text={inhalt.texte.t1KompakteAktuelleInformationsquelle} /></span>
              </div>
              <p className="text-xs sm:text-sm text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.schlussMitUnübersichtlichenNormenstapeln} /></p>
              <ul className="space-y-2 text-xs text-text-main/75 pl-1">
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-shiraz shrink-0 mt-0.5" />
                  <span><MdText text={inhalt.texte.neuesteNormengenerationExpositionsklasse} /></span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-shiraz shrink-0 mt-0.5" />
                  <span><MdText text={inhalt.texte.ganzheitlicheWerkstoffkundeVonMetallisch} /></span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-shiraz shrink-0 mt-0.5" />
                  <span><MdText text={inhalt.texte.bauchemischePräzisionKristallinePhasenum} /></span>
                </li>
              </ul>
            </div>
            <div className="p-3 bg-white rounded-xl border border-home-grau/20 text-[11px] text-text-main/70"><MdText text={inhalt.texte.einsatzSchnellesNachschlagenVon} /></div>
          </div>

          {/* Säule 2 */}
          <div className="p-6 rounded-2xl border border-home-grau/30 bg-off-white flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2.5 text-emerald-800 font-bold text-base">
                <Calculator size={20} />
                <span><MdText text={inhalt.texte.t2InteraktiveAnwendungVon} /></span>
              </div>
              <p className="text-xs sm:text-sm text-text-main/80 leading-relaxed"><MdText text={inhalt.texte.keineStatischenPdfFormulare} /></p>
              <ul className="space-y-2 text-xs text-text-main/75 pl-1">
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-emerald-700 shrink-0 mt-0.5" />
                  <span><MdText text={inhalt.texte.expositionsklassenHüllwerteMehrfachselek} /></span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-emerald-700 shrink-0 mt-0.5" />
                  <span><MdText text={inhalt.texte.betonkennwerteNachEc2Zeitabhängige} /></span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-emerald-700 shrink-0 mt-0.5" />
                  <span><MdText text={inhalt.texte.laborBauphysiksimulationMischungsberechn} /></span>
                </li>
              </ul>
            </div>
            <div className="p-3 bg-white rounded-xl border border-home-grau/20 text-[11px] text-text-main/70"><MdText text={inhalt.texte.zahlenformatAlleRechnerNutzen} /></div>
          </div>

        </div>

        {/* 3-SCHRITTE-WORKFLOW */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-text-main flex items-center gap-2 pb-2 border-b border-home-grau/20">
            <Activity className="text-shiraz" size={20} /><MdText text={inhalt.texte.der3SchritteWorkflow} /></h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-xl border border-home-grau/25 bg-white shadow-xs space-y-2">
              <div className="w-10 h-10 rounded-xl bg-shiraz/10 text-shiraz font-bold flex items-center justify-center text-sm">
                1
              </div>
              <h4 className="font-bold text-sm text-text-main"><MdText text={inhalt.texte.recherchierenErkunden} /></h4>
              <p className="text-xs text-text-main/75 leading-relaxed"><MdText text={inhalt.texte.wählenSieImMenü} /></p>
            </div>

            <div className="p-5 rounded-xl border border-home-grau/25 bg-white shadow-xs space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-700/10 text-emerald-800 font-bold flex items-center justify-center text-sm">
                2
              </div>
              <h4 className="font-bold text-sm text-text-main"><MdText text={inhalt.texte.interaktivBerechnen} /></h4>
              <p className="text-xs text-text-main/75 leading-relaxed"><MdText text={inhalt.texte.öffnenSieDenInteraktiven} /></p>
            </div>

            <div className="p-5 rounded-xl border border-home-grau/25 bg-white shadow-xs space-y-2">
              <div className="w-10 h-10 rounded-xl bg-cyan-700/10 text-cyan-800 font-bold flex items-center justify-center text-sm">
                3
              </div>
              <h4 className="font-bold text-sm text-text-main"><MdText text={inhalt.texte.verifizierenAnwenden} /></h4>
              <p className="text-xs text-text-main/75 leading-relaxed"><MdText text={inhalt.texte.nutzenSieDieFormelsammlung} /></p>
            </div>
          </div>
        </div>

        {/* METHODISCHE TRENNUNG: BAUSTOFFE VS. BAUPRODUKTE */}
        <div className="bg-slate-50/50 border border-slate-200/80 p-6 rounded-xl text-left w-full space-y-4">
          <div className="flex items-start gap-4">
            <Layers className="text-slate-500 shrink-0 mt-1" size={24} />
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900 font-sans"><MdText text={inhalt.texte.methodischeTrennungBaustoffeStoffebene} /></h3>
              <p className="text-slate-600 text-sm leading-relaxed"><MdText text={inhalt.texte.umInformationsdopplungenZuVermeiden} /></p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            
            {/* Linke Spalte: Baustoffe */}
            <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-xs flex flex-col justify-between">
              <div>
                <span className="inline-block px-2.5 py-0.5 text-[9.5px] font-semibold text-slate-700 bg-slate-100 border border-slate-200 rounded-full mb-3 uppercase tracking-wider"><MdText text={inhalt.texte.baustoffEbeneStoffeigenschaften} /></span>
                <p className="text-xs text-slate-700 leading-relaxed mb-4"><MdText text={inhalt.texte.untersuchtDieAtomareKristalline} /></p>
                <ul className="space-y-2 text-[11px] text-slate-600 pl-1">
                  <li className="flex items-start gap-1.5">
                    <span className="text-slate-400 font-bold">•</span>
                    <span><MdText text={inhalt.texte.hydratationPhasenBogueBerechnung} /></span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-slate-400 font-bold">•</span>
                    <span><MdText text={inhalt.texte.anisotropieRichtungsabhängigeQuellSchwin} /></span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-slate-400 font-bold">•</span>
                    <span><MdText text={inhalt.texte.werkstoffmechanikSpannungsDehnungsGesetz} /></span>
                  </li>
                </ul>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[10px] text-slate-400 italic"><MdText text={inhalt.texte.clusterBaustoffeBetontechnologieMechanik} /></div>
            </div>

            {/* Rechte Spalte: Bauprodukte */}
            <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-xs flex flex-col justify-between">
              <div>
                <span className="inline-block px-2.5 py-0.5 text-[9.5px] font-semibold text-slate-700 bg-slate-100 border border-slate-200 rounded-full mb-3 uppercase tracking-wider"><MdText text={inhalt.texte.bauproduktEbeneKonstruktionRecht} /></span>
                <p className="text-xs text-slate-700 leading-relaxed mb-4"><MdText text={inhalt.texte.fokussiertDasInVerkehr} /></p>
                <ul className="space-y-2 text-[11px] text-slate-600 pl-1">
                  <li className="flex items-start gap-1.5">
                    <span className="text-slate-400 font-bold">•</span>
                    <span><MdText text={inhalt.texte.bauproduktenverordnungBaupvoCeKennzeichn} /></span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-slate-400 font-bold">•</span>
                    <span><MdText text={inhalt.texte.bauteilgeometrieSortenCltBrettsperrholz} /></span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-slate-400 font-bold">•</span>
                    <span><MdText text={inhalt.texte.funktionaleEinheitÖkobilanzVergleichbare} /></span>
                  </li>
                </ul>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-[10px] text-slate-400 italic"><MdText text={inhalt.texte.clusterBauprodukteMassivbauHolzbau} /></div>
            </div>

          </div>
        </div>

        {/* QUALITÄTSSTANDARD D1-D6 */}
        <div className="bg-slate-50/60 p-6 rounded-2xl border border-slate-200/80 flex flex-col gap-4 text-left">
          <div className="flex items-center gap-3 pb-2 border-b border-home-grau/20">
            <div className="p-2 bg-shiraz/10 text-shiraz rounded-xl">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-text-main"><MdText text={inhalt.texte.die6QualitätsdimensionenAller} /></h3>
              <p className="text-xs text-text-main/70"><MdText text={inhalt.texte.verbindlicherStandardFürRichtigkeit} /></p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
            <div className="p-3.5 bg-white rounded-xl border border-home-grau/20 space-y-1">
              <span className="font-bold text-xs text-shiraz block"><MdText text={inhalt.texte.d1RichtigkeitNormen} /></span>
              <p className="text-[11px] text-text-main/75 leading-relaxed"><MdText text={inhalt.texte.strikteNormengenerationDin1045} /></p>
            </div>
            <div className="p-3.5 bg-white rounded-xl border border-home-grau/20 space-y-1">
              <span className="font-bold text-xs text-shiraz block"><MdText text={inhalt.texte.d2Didaktik4Stufen} /></span>
              <p className="text-[11px] text-text-main/75 leading-relaxed"><MdText text={inhalt.texte.logischeAbfolgeVonTheoretischen} /></p>
            </div>
            <div className="p-3.5 bg-white rounded-xl border border-home-grau/20 space-y-1">
              <span className="font-bold text-xs text-shiraz block"><MdText text={inhalt.texte.d3ThematischeVollständigkeit} /></span>
              <p className="text-[11px] text-text-main/75 leading-relaxed"><MdText text={inhalt.texte.keineFachlichenLückenOder} /></p>
            </div>
            <div className="p-3.5 bg-white rounded-xl border border-home-grau/20 space-y-1">
              <span className="font-bold text-xs text-shiraz block"><MdText text={inhalt.texte.d4PraxisrelevanzForensik} /></span>
              <p className="text-[11px] text-text-main/75 leading-relaxed"><MdText text={inhalt.texte.direkteHandlungskompetenzFürBaustelle} /></p>
            </div>
            <div className="p-3.5 bg-white rounded-xl border border-home-grau/20 space-y-1">
              <span className="font-bold text-xs text-shiraz block"><MdText text={inhalt.texte.d5KonsistenzVernetzung} /></span>
              <p className="text-[11px] text-text-main/75 leading-relaxed"><MdText text={inhalt.texte.einheitlicheNomenklaturDurchgängigesShir} /></p>
            </div>
            <div className="p-3.5 bg-white rounded-xl border border-home-grau/20 space-y-1">
              <span className="font-bold text-xs text-shiraz block"><MdText text={inhalt.texte.d6InteraktivitätVerifikation} /></span>
              <p className="text-[11px] text-text-main/75 leading-relaxed"><MdText text={inhalt.texte.dynamischeRechnerMitDeutscher} /></p>
            </div>
          </div>
        </div>

        {/* PRAXISTIPPS FÜR DIE NUTZUNG */}
        <div className="p-5 bg-off-white rounded-xl border border-home-grau/25 space-y-3 text-left">
          <h4 className="font-bold text-sm text-text-main"><MdText text={inhalt.texte.effektiveNutzungImStudien} /></h4>
          <ul className="list-disc list-inside space-y-1.5 text-xs text-text-main/80 leading-relaxed">
            <li><MdText text={inhalt.texte.parameterAnGrenzenTesten} /></li>
            <li><MdText text={inhalt.texte.pdfExportNutzenSie} /></li>
            <li><MdText text={inhalt.texte.vektorskizzenNutzenDieInteraktiven} /></li>
          </ul>
        </div>

      </div>

      <ModuleFooter
        wikipedia={[
          { title: 'Bauingenieurwesen', url: 'https://de.wikipedia.org/wiki/Bauingenieurwesen' },
          { title: 'Baustoffkunde', url: 'https://de.wikipedia.org/wiki/Baustoff' },
          { title: 'Eurocode', url: 'https://de.wikipedia.org/wiki/Eurocode' }
        ]}
        literatur={inhalt.daten["Anleitung.literatur"]}
        regelwerke={inhalt.daten["Anleitung.regelwerke"]}
        formeln={inhalt.daten["Anleitung.formeln"]}
      />
    </div>
  );
}
