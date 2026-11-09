import React, { useState } from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { 
  Landmark, Hammer, Scale, Coins, 
  ShieldAlert, Check, TrendingUp, AlertTriangle, BookOpen, Info
} from 'lucide-react';
import inhalt from '@/content/denkmalpflege/Denkmalpflege.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { ReiterLeiste, alsReiter, reiterPanel } from '../components/ui/Auswahlgruppe';

export default function Denkmalpflege() {
  const [activeSubTab, setActiveSubTab] = useState<'allgemeines' | 'baydschg' | 'bauphysik' | 'ablauf'>('allgemeines');

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        {/* Header Section */}
        <div className="flex flex-col gap-4 mb-6 border-b border-home-grau/30 pb-6">
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Landmark className="text-shiraz" size={24} /><MdText text={inhalt.texte.denkmalschutzDenkmalpflegeBayerischesBau} /></h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.wissenschaftlicheUndBautechnischeStandar} /></p>
        </div>
        </div>

        {/* Dynamic Sub-Navigation Grid */}
        <div className="p-4 bg-slate-50 border border-home-grau/30 rounded-2xl mb-6">
          <ReiterLeiste label="Bereiche Denkmalpflege" className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { id: 'allgemeines' as const, label: inhalt.werte.grundlagenCharta, sub: inhalt.werte.definitionenWerteChartaVon, icon: Landmark },
              { id: 'baydschg' as const, label: inhalt.werte.fokusBayernBaydschg, sub: inhalt.werte.deklaratorischesPrinzipArt6, icon: Scale },
              { id: 'bauphysik' as const, label: inhalt.werte.bauphysikInnendämmung, sub: inhalt.werte.gegBefreiungenWtaVorgaben, icon: Hammer },
              { id: 'ablauf' as const, label: inhalt.werte.behördenSteuern, sub: inhalt.werte.genehmigungenSonderAfa7i, icon: Coins }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeSubTab === tab.id;
              return (
                <button {...alsReiter(isActive, 'denkmal-bereich', tab.id)}
                  key={tab.id}
                  onClick={() => setActiveSubTab(tab.id)}
                  className={`p-4 rounded-xl border transition-all duration-200 flex flex-col items-start gap-1.5 text-left h-full cursor-pointer group ${
                    isActive 
                      ? 'bg-shiraz border-shiraz text-white shadow-md shadow-rose-100' 
                      : 'bg-white border-home-grau/30 hover:bg-slate-100 text-slate-700 hover:border-home-grau/30 hover:shadow-sm'
                  }`}
                >
                  <div className={`p-1.5 rounded-lg ${isActive ? 'bg-white/10 text-white' : 'bg-rose-50 text-shiraz group-hover:bg-rose-100 transition-colors'}`}>
                    <Icon size={18} />
                  </div>
                  <span className={`text-xs font-bold leading-tight mt-1 ${isActive ? 'text-white' : 'text-slate-900'}`}>
                    {tab.label}
                  </span>
                  <span className={`text-xs leading-tight ${isActive ? 'text-rose-100/90' : 'text-slate-500'}`}>
                    {tab.sub}
                  </span>
                </button>
              );
            })}
          </ReiterLeiste>
        </div>

        {/* Tab content area */}
        <div className="space-y-6">

          {/* Sub-Tab 1: Allgemeines */}
          {activeSubTab === 'allgemeines' && (
            <div {...reiterPanel('denkmal-bereich', activeSubTab)} className="flex flex-col gap-6 animate-in fade-in duration-300">
              <div className="bg-slate-50 border border-home-grau/30 p-5 rounded-2xl flex flex-col md:flex-row gap-5">
                <div className="flex-1 space-y-2">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <Info size={16} className="text-shiraz" /><MdText text={inhalt.texte.wasUnterscheidetSchutzUnd} /></h3>
                  <p className="text-slate-700 text-xs leading-relaxed"><MdText text={inhalt.texte.imBaualltagWerdenDenkmalschutz} /></p>
                  <ul className="list-disc pl-5 text-xs text-slate-600 space-y-1.5">
                    <li><MdText text={inhalt.texte.denkmalschutzHoheitlichDieRechtliche} /></li>
                    <li><MdText text={inhalt.texte.denkmalpflegeWissenschaftlichPraktischDi} /></li>
                  </ul>
                </div>
                <div className="md:w-px md:bg-slate-200 self-stretch"></div>
                <div className="flex-1 space-y-2">
                  <h3 className="font-semibold text-slate-900 text-sm"><MdText text={inhalt.texte.dieDreiDenkmalkategorien} /></h3>
                  <div className="grid grid-cols-1 gap-2 text-xs">
                    <div className="bg-white p-2.5 rounded-lg border border-home-grau/30">
                      <strong className="text-slate-800"><MdText text={inhalt.texte.t1Baudenkmal} /></strong><MdText text={inhalt.texte.baulicheAnlagenDerenErhalt} /></div>
                    <div className="bg-white p-2.5 rounded-lg border border-home-grau/30">
                      <strong className="text-slate-800"><MdText text={inhalt.texte.t2EnsembleGesamtanlage} /></strong><MdText text={inhalt.texte.einZusammenhängendesStadtOder} /></div>
                    <div className="bg-white p-2.5 rounded-lg border border-home-grau/30">
                      <strong className="text-slate-800"><MdText text={inhalt.texte.t3Bodendenkmal} /></strong><MdText text={inhalt.texte.archäologischeGüterImBoden} /></div>
                  </div>
                </div>
              </div>

              <div className="border border-home-grau/30 rounded-2xl p-5 space-y-4 shadow-sm bg-white">
                <div className="flex items-center gap-2">
                  <BookOpen className="text-shiraz" size={20} />
                  <h4 className="font-bold text-slate-900 text-sm"><MdText text={inhalt.texte.denkmalpflegerischeGrundsätzeUA} /></h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed"><MdText text={inhalt.texte.die1964VerabschiedeteCharta} /></p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50/50 p-3.5 rounded-xl border border-home-grau/30 flex gap-3">
                    <span className="text-shiraz font-mono font-bold text-xs mt-0.5">I.</span>
                    <div>
                      <strong className="text-slate-800 text-xs block mb-1"><MdText text={inhalt.texte.erhaltDerOriginalsubstanz} /></strong>
                      <p className="text-xs text-slate-600 leading-normal"><MdText text={inhalt.texte.jedesFragmentDesOriginals} /></p>
                    </div>
                  </div>

                  <div className="bg-slate-50/50 p-3.5 rounded-xl border border-home-grau/30 flex gap-3">
                    <span className="text-shiraz font-mono font-bold text-xs mt-0.5">II.</span>
                    <div>
                      <strong className="text-slate-800 text-xs block mb-1"><MdText text={inhalt.texte.materialverträglichkeitSpätererFachgrund} /></strong>
                      <p className="text-xs text-slate-600 leading-normal"><MdText text={inhalt.texte.neueBaustoffeMüssenMaterialtechnisch} /></p>
                    </div>
                  </div>

                  <div className="bg-slate-50/50 p-3.5 rounded-xl border border-home-grau/30 flex gap-3">
                    <span className="text-shiraz font-mono font-bold text-xs mt-0.5">III.</span>
                    <div>
                      <strong className="text-slate-800 text-xs block mb-1">Reversibilität</strong>
                      <p className="text-xs text-slate-600 leading-normal"><MdText text={inhalt.texte.denkmalgerechteEingriffeSolltenBei} /></p>
                    </div>
                  </div>

                  <div className="bg-slate-50/50 p-3.5 rounded-xl border border-home-grau/30 flex gap-3">
                    <span className="text-shiraz font-mono font-bold text-xs mt-0.5">IV.</span>
                    <div>
                      <strong className="text-slate-800 text-xs block mb-1"><MdText text={inhalt.texte.erkennbarkeitVonErgänzungen} /></strong>
                      <p className="text-xs text-slate-600 leading-normal"><MdText text={inhalt.texte.fehlendeTeileDürfenErsetzt} /></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sub-Tab 2: Fokus Bayern (BayDSchG) */}
          {activeSubTab === 'baydschg' && (
            <div {...reiterPanel('denkmal-bereich', activeSubTab)} className="flex flex-col gap-6 animate-in fade-in duration-300">
              
              {/* Highlight Banner: Das Deklaratorische Prinzip */}
              <div className="bg-rose-50/50 border border-rose-200/60 p-5 rounded-2xl space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-rose-100 rounded-lg text-shiraz">
                    <ShieldAlert size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm"><MdText text={inhalt.texte.dasDeklaratorischePrinzipArt} /></h3>
                    <span className="text-xs text-shiraz font-semibold tracking-wider uppercase block"><MdText text={inhalt.texte.hochpräzisesLandesrechtInGanz} /></span>
                  </div>
                </div>
                <div className="text-xs text-slate-700 leading-relaxed md:pr-4">
                  <p className="mb-2"><MdText text={inhalt.texte.obDieEintragungIn} /></p>
                  <p className="bg-white p-3 rounded-xl border border-rose-100 text-slate-800 shadow-sm leading-relaxed"><MdText text={inhalt.texte.derBayerischeSystemwechselIn} /></p>
                  <p className="mt-2 text-rose-800 font-medium"><MdText text={inhalt.texte.planungsrisikoFindetEinArchitekt} /></p>
                </div>
              </div>

              {/* Erlaubnispflicht & Umgebungsschutz */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="border border-home-grau/30 p-5 rounded-2xl bg-white space-y-3 flex flex-col justify-between shadow-sm">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-xs font-mono font-bold"><MdText text={inhalt.texte.art6Abs1} /></span>
                      <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider"><MdText text={inhalt.texte.erlaubnispflichtenAmBaudenkmal} /></h4>
                    </div>
                    <p className="text-slate-600 text-xs leading-relaxed"><MdText text={inhalt.texte.sämtlicheEingriffeSanierungenUmnutzungen} /></p>
                    <p className="text-slate-600 text-xs leading-relaxed"><MdText text={inhalt.texte.wirdDasBauvorhabenBaugenehmigungspflicht} /></p>
                  </div>
                  <div className="bg-slate-50 p-2 text-xs text-slate-500 rounded border border-home-grau/30 mt-2"><MdText text={inhalt.texte.beispielAustauschHistorischerKastenfenst} /></div>
                </div>

                <div className="border border-home-grau/30 p-5 rounded-2xl bg-white space-y-3 flex flex-col justify-between shadow-sm">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-xs font-mono font-bold"><MdText text={inhalt.texte.art6BaydschgUmgebung} /></span>
                      <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider"><MdText text={inhalt.texte.derUmgebungsschutz} /></h4>
                    </div>
                    <p className="text-slate-600 text-xs leading-relaxed"><MdText text={inhalt.texte.derSchutzbereichEndetIn} /></p>
                    <p className="text-slate-600 text-xs leading-relaxed"><MdText text={inhalt.texte.dasKriteriumIstDie} /></p>
                  </div>
                  <div className="bg-slate-50 p-2 text-xs text-slate-500 rounded border border-home-grau/30 mt-2"><MdText text={inhalt.texte.beispielDieErrichtungEines} /></div>
                </div>

              </div>

              {/* Fundmeldungen & Das bayerische Schatzregal */}
              <div className="border border-home-grau/30 p-5 rounded-2xl bg-white space-y-4 shadow-sm">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="text-amber-600" size={18} />
                  <h4 className="font-bold text-slate-800 text-sm"><MdText text={inhalt.texte.archäologischerFundBeimAushub} /></h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed"><MdText text={inhalt.texte.trittImRahmenVon} /></p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-slate-50 p-3 rounded-xl border border-home-grau/30">
                    <span className="font-bold text-slate-950 block mb-1"><MdText text={inhalt.texte.t1StopAbsichern} /></span><MdText text={inhalt.texte.derArchäologieBefundMuss} /></div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-home-grau/30">
                    <span className="font-bold text-slate-950 block mb-1"><MdText text={inhalt.texte.t2SofortigeMeldung} /></span><MdText text={inhalt.texte.anzeigeDesFundesBei} /></div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-home-grau/30">
                    <span className="font-bold text-slate-950 block mb-1"><MdText text={inhalt.texte.t3WartezeitArt8} /></span><MdText text={inhalt.texte.dieFundstelleMussUnverändert} /></div>
                </div>

                <div className="mt-4 pt-4 border-t border-home-grau/30">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-xs font-bold rounded uppercase">Rechtsänderung</span>
                    <h5 className="font-bold text-slate-800 text-xs"><MdText text={inhalt.texte.änderungJuli2023Einführung} /></h5>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed"><MdText text={inhalt.texte.jahrzehntelangWarBayernDas} /></p>
                  <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-home-grau/30 mt-2 leading-relaxed"><MdText text={inhalt.texte.zum1Juli2023} /></p>
                </div>
              </div>

            </div>
          )}

          {/* Sub-Tab 3: Sanierung & Bauphysik */}
          {activeSubTab === 'bauphysik' && (
            <div {...reiterPanel('denkmal-bereich', activeSubTab)} className="flex flex-col gap-6 animate-in fade-in duration-300">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* GEG Befreiung */}
                <div className="border border-home-grau/30 p-5 rounded-2xl bg-white space-y-3 shadow-sm flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5 wie-h4">
                      <Check className="text-emerald-600" size={16} /><MdText text={inhalt.texte.t105GmodgVormalsGeg} /></h3>
                    <p className="text-slate-600 text-xs leading-relaxed"><MdText text={inhalt.texte.dasGebäudemodernisierungsgesetzVormalsGe} /></p>
                    <p className="text-slate-600 text-xs leading-relaxed"><MdText text={inhalt.texte.einePflichtZurDurchführung} /></p>
                  </div>
                  <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl text-emerald-800 text-xs leading-relaxed"><MdText text={inhalt.texte.tippFürEnergieberaterBei} /></div>
                </div>

                {/* Materialverträglichkeit */}
                <div className="border border-home-grau/30 p-5 rounded-2xl bg-white space-y-3 shadow-sm flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5 wie-h4">
                      <AlertTriangle className="text-rose-600" size={16} /><MdText text={inhalt.texte.materialverträglichkeitPutzschäden} /></h3>
                    <p className="text-slate-600 text-xs leading-relaxed"><MdText text={inhalt.texte.einHauptgrundFürSchäden} /></p>
                    <p className="text-slate-600 text-xs leading-relaxed"><MdText text={inhalt.texte.daFeuchtigkeitNichtAbtrocknen} /></p>
                  </div>
                  <div className="p-3 bg-rose-50/40 border border-rose-100 rounded-xl text-rose-800 text-xs leading-relaxed"><MdText text={inhalt.texte.dasGebotVerwendungElastischerer} /></div>
                </div>
              </div>

              {/* Innendämmung und WTA Richtlinien */}
              <div className="border border-home-grau/30 p-5 rounded-2xl bg-white space-y-4 shadow-sm">
                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5 wie-h4">
                  <Hammer size={18} className="text-shiraz animate-bounce" /><MdText text={inhalt.texte.innendämmungNachWtaRichtlinie} /></h3>
                <p className="text-xs text-slate-600 leading-relaxed"><MdText text={inhalt.texte.daAußendämmungenWdvsWegen} /></p>

                <div className="bg-slate-50 p-4 rounded-xl space-y-3 border border-home-grau/30">
                  <h4 className="font-bold text-slate-800 text-xs wie-h5"><MdText text={inhalt.texte.zweiBewährteSystemprinzipien} /></h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium text-slate-900">
                    <div className="bg-white p-3 rounded-lg border border-home-grau/30 space-y-1">
                      <span className="text-rose-700 block font-bold"><MdText text={inhalt.texte.t1KapillaraktiveDampfoffeneSysteme} /></span>
                      <p className="text-xs text-slate-600 leading-relaxed font-normal"><MdText text={inhalt.texte.wirktOhneDampfbremseVerwendet} /></p>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-home-grau/30 space-y-1">
                      <span className="text-rose-700 block font-bold"><MdText text={inhalt.texte.t2HolzweichfaserplattenInLehmbettung} /></span>
                      <p className="text-xs text-slate-600 leading-relaxed font-normal"><MdText text={inhalt.texte.kapillaraktivesDiffusionsoffenesSorption} /></p>
                    </div>
                  </div>
                </div>

                <div className="text-xs bg-slate-100/50 p-2.5 rounded text-amber-950 font-medium"><MdText text={inhalt.texte.wtaVorschriftDieWta} /></div>
              </div>

            </div>
          )}

          {/* Sub-Tab 4: Behörden & Steuern */}
          {activeSubTab === 'ablauf' && (
            <div {...reiterPanel('denkmal-bereich', activeSubTab)} className="flex flex-col gap-6 animate-in fade-in duration-300">
              
              {/* Dreistufigkeit in Bayern */}
              <div className="border border-home-grau/30 p-5 rounded-2xl bg-white space-y-4 shadow-sm">
                <h3 className="font-bold text-slate-800 text-sm wie-h4"><MdText text={inhalt.texte.dasDenkmalpflegerischeDreistufenSystem} /></h3>
                <p className="text-xs text-slate-600 leading-relaxed"><MdText text={inhalt.texte.wieFastDerGesamte} /></p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-medium text-slate-900">
                  <div className="p-4 bg-slate-50 border border-home-grau/30 rounded-xl space-y-1">
                    <span className="text-slate-400 font-bold block text-xs uppercase"><MdText text={inhalt.texte.t1ObersteBehörde} /></span>
                    <strong className="text-slate-900 block font-bold">Staatsministerium</strong>
                    <p className="text-xs text-slate-500 leading-relaxed font-normal"><MdText text={inhalt.texte.bayerischesStaatsministeriumFürWissensch} /></p>
                  </div>
                  <div className="p-4 bg-slate-50 border border-home-grau/30 rounded-xl space-y-1">
                    <span className="text-shiraz font-bold block text-xs uppercase"><MdText text={inhalt.texte.t2Fachbehörde} /></span>
                    <strong className="text-slate-900 block font-bold"><MdText text={inhalt.texte.blfdLandesamt} /></strong>
                    <p className="text-xs text-slate-500 leading-relaxed font-normal"><MdText text={inhalt.texte.bayerischesLandesamtFürDenkmalpflege} /></p>
                  </div>
                  <div className="p-4 bg-slate-50 border border-home-grau/30 rounded-xl space-y-1">
                    <span className="text-slate-400 font-bold block text-xs uppercase"><MdText text={inhalt.texte.t3UntereBehörde} /></span>
                    <strong className="text-slate-900 block font-bold"><MdText text={inhalt.texte.landratsamtStadtverwaltung} /></strong>
                    <p className="text-xs text-slate-500 leading-relaxed font-normal"><MdText text={inhalt.texte.dieVollzugsbehördeAnsprechpartnerFür} /></p>
                  </div>
                </div>
              </div>

              {/* Steuerliche Denkmalabschreibung */}
              <div className="border border-home-grau/30 p-5 rounded-2xl bg-white space-y-4 shadow-sm">
                <div className="flex items-center gap-2">
                  <TrendingUp className="text-shiraz animate-pulse" size={18} />
                  <h3 className="font-bold text-slate-800 text-sm wie-h4"><MdText text={inhalt.texte.dieSonderAfaDes} /></h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed"><MdText text={inhalt.texte.dieSanierungHistorischerGebäude} /></p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/30 flex flex-col justify-between">
                    <div className="space-y-1">
                      <strong className="text-xs text-slate-950 block"><MdText text={inhalt.texte.t7iEstgVermietungBetrieb} /></strong>
                      <span className="text-shiraz font-bold text-sm block"><MdText text={inhalt.texte.t12JahreLangAbschreibung} /></span>
                      <p className="text-xs text-slate-600 leading-relaxed"><MdText text={inhalt.texte.kapitalanlegerKönnenAlleFür} /></p>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-home-grau/30 flex flex-col justify-between">
                    <div className="space-y-1">
                      <strong className="text-xs text-slate-950 block"><MdText text={inhalt.texte.t10fEstgEigennutzung} /></strong>
                      <span className="text-shiraz font-bold text-sm block"><MdText text={inhalt.texte.t10JahreLangAbschreibung} /></span>
                      <p className="text-xs text-slate-600 leading-relaxed"><MdText text={inhalt.texte.werDasDenkmalSelbst} /></p>
                    </div>
                  </div>
                </div>

                <div className="bg-rose-50/50 p-3 rounded-xl border border-rose-100 text-xs text-rose-900 leading-relaxed"><MdText text={inhalt.texte.wichtigeFristSteuervorteileUnterliegen} /></div>
              </div>

            </div>
          )}

        </div>
      </div>
      
      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <FormulaDerivationBox
        title={inhalt.werte.beispiel1KristallisationsdruckVon}
        zielGleichung="p = \frac{R \cdot T}{V_m} \cdot \ln\frac{c}{c_s}"
        schritte={inhalt.daten["Denkmalpflege.schritte"]}
        ergebnisHinweis={inhalt.werte.schonGeringeÜbersättigungenErzeugen}
        normQuelle={inhalt.werte.correns1949WtaMerkblatt}
      />
      <FormulaDerivationBox
        title={inhalt.werte.beispiel2DenkmalverträglicheInnendämmung}
        zielGleichung="U_{neu} = \frac{1}{1/U_{alt} + d/\lambda}"
        schritte={inhalt.daten["Denkmalpflege.schritte_2"]}
        ergebnisHinweis={inhalt.werte.beiFachwerkSindSchlagregenbelastung}
        normQuelle={inhalt.werte.gmodg105WtaMerkblätter}
      />

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="denkmalpflege" />

      <ModuleFooter
        lastReviewed={inhalt.werte.oktober2026Ap8} 
        weblinks={inhalt.daten["Denkmalpflege.weblinks"]}
        wikipedia={[
          { title: inhalt.werte.bayerischesDenkmalschutzgesetz, url: "https://de.wikipedia.org/wiki/Bayerisches_Denkmalschutzgesetz" },
          { title: inhalt.werte.bayerischesLandesamtFürDenkmalpflege, url: "https://de.wikipedia.org/wiki/Bayerisches_Landesamt_f%C3%BCr_Denkmalpflege" },
          { title: "Schatzregal", url: "https://de.wikipedia.org/wiki/Schatzregal" },
          { title: inhalt.werte.chartaVonVenedig, url: "https://de.wikipedia.org/wiki/Charta_von_Venedig" }
        ]} 
        literatur={inhalt.daten["Denkmalpflege.literatur"]} 
        regelwerke={inhalt.daten["Denkmalpflege.regelwerke"]} 
        formeln={inhalt.daten["Denkmalpflege.formeln"]} 
      />
    </div>
  );
}
