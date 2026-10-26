import React from 'react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { useTabContext } from '@/src/contexts/TabContext';
import { 
  ClipboardCheck, 
  Wrench, 
  Factory, 
  GraduationCap, 
  AlertOctagon, 
  BookOpen, 
  Award,
  Info
} from 'lucide-react';
import inhalt from '@/content/praxiswissen/Praxiswissen.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { ModuleTabs } from '@/src/components/ui/ModuleTabs';

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  important?: boolean;
  standard?: string;
  tip?: string;
}

interface Section {
  id: string;
  title: string;
  description: string;
  items: ChecklistItem[];
}

interface TabContent {
  title: string;
  tagline: string;
  icon: React.ReactNode;
  themeColor: string;
  intro: string;
  sections: Section[];
  traps: { title: string; consequence: string; avoid: string }[];
  professionalTip: string;
}

const DATA_PLANUNG: TabContent = {
  title: inhalt.werte.planungAusschreibung,
  tagline: inhalt.werte.sichereLvErstellungNormenkonformität,
  icon: <ClipboardCheck size={28} className="text-shiraz" />,
  themeColor: "shiraz",
  intro: inhalt.werte.derErfolgEinesBauvorhabens,
  sections: inhalt.daten["DATA_PLANUNG.sections"],
  traps: inhalt.daten["DATA_PLANUNG.traps"],
  professionalTip: inhalt.werte.erstellenSieAmEnde
};

const DATA_BAULEITUNG: TabContent = {
  title: inhalt.werte.bauleitungBaustelle,
  tagline: inhalt.werte.qualitätssicherungVorOrtAbnahmeprozesse,
  icon: <Wrench size={28} className="text-shiraz" />,
  themeColor: "shiraz",
  intro: inhalt.werte.dieBaustelleVerzeihtKeine,
  sections: inhalt.daten["DATA_BAULEITUNG.sections"],
  traps: inhalt.daten["DATA_BAULEITUNG.traps"],
  professionalTip: inhalt.werte.inDerBauleitungWerden
};

const DATA_PRODUKTION: TabContent = {
  title: inhalt.werte.produktherstellungQs,
  tagline: inhalt.werte.werkseigeneProduktionskontrolleWpkCe,
  icon: <Factory size={28} className="text-shiraz" />,
  themeColor: "shiraz",
  intro: inhalt.werte.inDenHerstellerwerkenFür,
  sections: inhalt.daten["DATA_PRODUKTION.sections"],
  traps: inhalt.daten["DATA_PRODUKTION.traps"],
  professionalTip: inhalt.werte.führenSieImWerk
};

const DATA_KARRIERE: TabContent = {
  title: inhalt.werte.karrierestartSoftSkills,
  tagline: inhalt.werte.dieErsten100Tage,
  icon: <GraduationCap size={28} className="text-shiraz" />,
  themeColor: "shiraz",
  intro: inhalt.werte.derÜbergangVonDer,
  sections: inhalt.daten["DATA_KARRIERE.sections"],
  traps: inhalt.daten["DATA_KARRIERE.traps"],
  professionalTip: inhalt.werte.legenSieSichIn
};

export default function Praxiswissen() {
  const { activeTab: globalActiveTab, setActiveTab: setGlobalActiveTab } = useTabContext();
  
  const activeTab = React.useMemo(() => {
    if (globalActiveTab === 'px_bauleitung') return 'bauleitung';
    if (globalActiveTab === 'px_produktion') return 'produktion';
    if (globalActiveTab === 'px_karriere') return 'karriere';
    return 'planung';
  }, [globalActiveTab]);

  const setActiveTab = (tab: 'planung' | 'bauleitung' | 'produktion' | 'karriere') => {
    if (tab === 'planung') setGlobalActiveTab('px_planung');
    else if (tab === 'bauleitung') setGlobalActiveTab('px_bauleitung');
    else if (tab === 'produktion') setGlobalActiveTab('px_produktion');
    else if (tab === 'karriere') setGlobalActiveTab('px_karriere');
  };

  const currentData = React.useMemo(() => {
    switch (activeTab) {
      case 'planung': return DATA_PLANUNG;
      case 'bauleitung': return DATA_BAULEITUNG;
      case 'produktion': return DATA_PRODUKTION;
      case 'karriere': return DATA_KARRIERE;
    }
  }, [activeTab]);

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        
        {/* HEADER BLOCK */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-home-grau/30">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-shiraz/10 rounded-xl text-shiraz">
              <Award size={32} />
            </div>
            <h2 className="text-xl font-bold text-text-main flex items-center gap-2"><MdText text={inhalt.texte.praxiswissenBauChecklisten} /></h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.praxisnaheLeitfädenSchnittstellenprüfung} /></p>
        </div>
          </div>
        </div>

        <ModuleTabs
          label={inhalt.werte.bereichePraxiswissen}
          tabs={[
            { id: 'planung' as const, label: inhalt.werte.planungAusschreibung2, icon: ClipboardCheck },
            { id: 'bauleitung' as const, label: inhalt.werte.bauleitungBaustelle2, icon: Wrench },
            { id: 'produktion' as const, label: inhalt.werte.produktherstellungQs2, icon: Factory },
            { id: 'karriere' as const, label: inhalt.werte.karrierestartSoftSkills2, icon: GraduationCap }
          ]}
          aktiv={activeTab}
          onWechsel={setActiveTab}
          className="[&>[role=tablist]]:mb-6 [&>[role=tablist]]:pb-4 [&>[role=tablist]]:border-b [&>[role=tablist]]:border-home-grau/30"
        >
        {/* MAIN BODY LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT PANEL: CHECKLIST ENGINE */}
          <div className="lg:col-span-8 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                {currentData.icon}
                <h3 className="text-xl font-bold text-text-main flex items-center gap-2">{currentData.title}</h3>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>
            {currentData.tagline}
          </p>
        </div>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed bg-slate-50 p-4 border border-home-grau/30 rounded-xl">
                {currentData.intro}
              </p>
            </div>

            {/* CHECKLIST SECTIONS */}
            {currentData.sections.map((section) => (
              <div key={section.id} className="space-y-3 bg-white border border-home-grau/30 p-5 rounded-2xl">
                <div className="flex items-center justify-between border-b border-home-grau/30 pb-2">
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">{section.title}</h4>
                    <p className="text-xs text-slate-500">{section.description}</p>
                  </div>
                </div>

                {/* ITEMS REPEATER */}
                <div className="divide-y divide-home-grau/10">
                  {section.items.map((item) => {
                    return (
                      <div 
                        key={item.id} 
                        className="py-3.5"
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-1.5 shrink-0 text-shiraz">
                            <span className="w-1.5 h-1.5 rounded-full bg-shiraz block"></span>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-semibold text-slate-900">
                                {item.title}
                              </span>
                              {item.standard && (
                                <span className="text-xs font-mono font-bold uppercase bg-slate-50 text-slate-700 border border-home-grau/30 px-1.5 py-0.5 rounded shrink-0">
                                  {item.standard}
                                </span>
                              )}
                            </div>
                            
                            <p className="text-sm text-slate-700 leading-relaxed mt-1">
                              {item.description}
                            </p>

                            {/* ALWAYS VISIBLE PRACTICE TIPS */}
                            {item.tip && (
                              <div className="mt-2.5 p-3 bg-slate-50 border border-home-grau/30 rounded-lg space-y-2">
                                <div className="text-xs sm:text-sm text-slate-800 flex gap-1.5 font-medium">
                                  <Info size={14} className="text-shiraz shrink-0 mt-0.5" />
                                  <span><strong>Praxis-Tipp:</strong> {item.tip}</span>
                                </div>
                              </div>
                            )}

                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT PANEL: EXPOSURE TO TRAPS, RED ZONES & PRO TIPS */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* TRAPS / FEHLER UND KONSEQUENZEN */}
            <div className="bg-rose-50/40 border border-shiraz/20 p-5 rounded-2xl space-y-4">
              <div className="flex items-center gap-2 border-b border-shiraz/10 pb-2">
                <AlertOctagon className="text-shiraz" size={20} />
                <span className="text-xs font-bold uppercase tracking-wider text-shiraz block font-bold"><MdText text={inhalt.texte.klassischeAnfängerfehler} /></span>
              </div>
              
              <div className="space-y-5">
                {currentData.traps.map((trap, index) => (
                  <div key={index} className="space-y-1.5">
                    <h5 className="font-bold text-sm text-slate-900 flex items-center gap-1">
                      <span className="shrink-0 text-shiraz font-bold">&#9888;</span> {trap.title}
                    </h5>
                    <p className="text-sm text-slate-700 leading-relaxed pl-3 border-l-2 border-shiraz/30">
                      <strong>Die Folge:</strong> {trap.consequence}
                    </p>
                    <p className="text-sm text-slate-700 leading-relaxed pl-3 border-l-2 border-home-grau/30"><MdText text={inhalt.texte.soVermeidenSieEs} />{trap.avoid}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* GOLDEN RULE / PROFESSOR'S TIP */}
            <div className="bg-slate-50 border border-home-grau/30 p-5 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm border-b border-home-grau/30 pb-2">
                <BookOpen size={16} className="text-shiraz" />
                <span><MdText text={inhalt.texte.professorenTippFürDen} /></span>
              </div>
              <p className="text-sm text-slate-750 leading-relaxed italic font-medium">
                &ldquo;{currentData.professionalTip}&rdquo;
              </p>
            </div>

            {/* STANDARDS / LEGAL BOUNDS BRIEF */}
            <div className="bg-slate-50 border border-home-grau/30 p-5 rounded-2xl space-y-3 text-sm">
              <span className="font-bold text-slate-900 block border-b border-home-grau/30 pb-2 text-sm"><MdText text={inhalt.texte.grundlegendeRegelwerke} /></span>
              <div className="space-y-2 text-sm text-slate-800 font-medium">
                <div className="flex items-start gap-1.5">
                  <span className="text-shiraz font-mono font-bold">•</span>
                  <span><MdText text={inhalt.texte.vobTeileAB} /></span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="text-shiraz font-mono font-bold">•</span>
                  <span><MdText text={inhalt.texte.bgbWerkvertragsrechtGesetzlicheAuffangor} /></span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="text-shiraz font-mono font-bold">•</span>
                  <span><MdText text={inhalt.texte.dinEn206Din} /></span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* INTERAKTIVE MITTEL-NAVIGATION FÜR SCHNELLEN REITERWECHSEL */}
        <div className="border-t border-home-grau/30 mt-8 pt-6 flex flex-wrap items-center justify-between gap-4">
          {activeTab !== 'planung' ? (
            <button
              onClick={() => {
                if (activeTab === 'bauleitung') setActiveTab('planung');
                else if (activeTab === 'produktion') setActiveTab('bauleitung');
                else if (activeTab === 'karriere') setActiveTab('produktion');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2 px-5 py-3 border border-home-grau/30 text-slate-700 hover:text-slate-900 hover:bg-slate-50 font-bold rounded-xl text-sm transition-all shadow-sm"
              type="button"
            ><MdText text={inhalt.texte.vorherigerSchritt} />{activeTab === 'bauleitung' && inhalt.werte.planungAusschreibung3}
              {activeTab === 'produktion' && inhalt.werte.bauleitungBaustelle3}
              {activeTab === 'karriere' && inhalt.werte.produktherstellungQs3}
            </button>
          ) : (
            <div />
          )}

          {activeTab !== 'karriere' ? (
            <button
              onClick={() => {
                if (activeTab === 'planung') setActiveTab('bauleitung');
                else if (activeTab === 'bauleitung') setActiveTab('produktion');
                else if (activeTab === 'produktion') setActiveTab('karriere');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2 px-6 py-3 bg-shiraz text-white hover:bg-shiraz/90 font-bold rounded-xl text-sm transition-all shadow-md ml-auto"
              type="button"
            ><MdText text={inhalt.texte.nächsterSchritt} />{activeTab === 'planung' && inhalt.werte.bauleitungBaustelle4}
              {activeTab === 'bauleitung' && inhalt.werte.produktherstellungQs4}
              {activeTab === 'produktion' && inhalt.werte.karrierestartSoftSkills3}{' '}
              &rarr;
            </button>
          ) : (
            <div />
          )}
        </div>
        </ModuleTabs>

      </div>

      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      {activeTab === 'planung' && (
        <>
      <FormulaDerivationBox
        title={inhalt.werte.beispiel1NennmaßDer}
        zielGleichung="c_{nom} = c_{min} + \Delta c_{dev},\quad c_{min} = \max(c_{min,b};\ c_{min,dur};\ 10\,\text{mm})"
        schritte={inhalt.daten["Praxiswissen.schritte"]}
        ergebnisHinweis={inhalt.werte.cNomGehörtIn}
        normQuelle={inhalt.werte.dinEn19921}
      />
      <FormulaDerivationBox
        title={inhalt.werte.beispiel2GleichwertigkeitEines}
        zielGleichung="R = \frac{d}{\lambda},\quad d_{erf} = R_{soll} \cdot \lambda_{alt}"
        schritte={inhalt.daten["Praxiswissen.schritte_2"]}
        ergebnisHinweis={inhalt.werte.gleichwertigkeitWirdAnDen}
        normQuelle={inhalt.werte.t7Abs2Vob}
      />
      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="px_planung" />
        </>
      )}
      {activeTab === 'bauleitung' && (
        <>
      <FormulaDerivationBox
        title={inhalt.werte.beispiel1WirkungUnzulässiger}
        zielGleichung="(w/z)_{neu} = \frac{w + \Delta w}{z}"
        schritte={inhalt.daten["Praxiswissen.schritte_3"]}
        ergebnisHinweis={inhalt.werte.schonKleineWassermengenVerbrauchen}
        normQuelle={inhalt.werte.dinEn206Din}
      />
      <FormulaDerivationBox
        title={inhalt.werte.beispiel2GrundwertDer}
        zielGleichung="l_{b,rqd} = \frac{\varnothing}{4} \cdot \frac{\sigma_{sd}}{f_{bd}}"
        schritte={inhalt.daten["Praxiswissen.schritte_4"]}
        ergebnisHinweis={inhalt.werte.beiDerAbnahmeWird}
        normQuelle={inhalt.werte.dinEn199212}
      />
      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="px_bauleitung" />
        </>
      )}
      {activeTab === 'produktion' && (
        <>
      <FormulaDerivationBox
        title={inhalt.werte.beispiel1FeuchtekorrekturBei}
        zielGleichung="m_{feucht} = m_{tr}(1 + u),\quad w_{Zugabe} = w_{soll} - u \cdot m_{tr}"
        schritte={inhalt.daten["Praxiswissen.schritte_5"]}
        ergebnisHinweis={inhalt.werte.dieOberflächenfeuchteMussAuf}
        normQuelle={inhalt.werte.dinEn206Din2}
      />
      <FormulaDerivationBox
        title={inhalt.werte.beispiel2KonformitätsnachweisDer}
        zielGleichung="f_{cm} \ge f_{ck} + 4,\quad f_{ci} \ge f_{ck} - 4"
        schritte={inhalt.daten["Praxiswissen.schritte_6"]}
        ergebnisHinweis={inhalt.werte.beideKriterienSindErfüllt}
        normQuelle={inhalt.werte.dinEn206Konformitätskriterien}
      />
      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="px_produktion" />
        </>
      )}
      {activeTab === 'karriere' && (
        <>
      <FormulaDerivationBox
        title={inhalt.werte.beispiel1AngebotspreisAus}
        zielGleichung="K_{Angebot} = (S_{Herstell} + AGK) \cdot (1 + W_G)"
        schritte={inhalt.daten["Praxiswissen.schritte_7"]}
        ergebnisHinweis={inhalt.werte.zuschlagssätzeSindUnternehmensspezifisch}
        normQuelle={inhalt.werte.baubetrieblicheKalkulationKlrBau}
      />
      <FormulaDerivationBox
        title={inhalt.werte.beispiel2LohnkostenEiner}
        zielGleichung="K_L = A \cdot AW \cdot ML"
        schritte={inhalt.daten["Praxiswissen.schritte_8"]}
        ergebnisHinweis={inhalt.werte.aufwandswerteUndMittellohnStammen}
        normQuelle={inhalt.werte.baubetrieblicheKalkulationLehrbeispiel}
      />
      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="px_karriere" />
        </>
      )}

      <ModuleFooter
        lastReviewed={inhalt.werte.oktober2026Ap15}
        wikipedia={[
          { title: inhalt.werte.leistungsbildHoai, url: 'https://de.wikipedia.org/wiki/Honorarordnung_f%C3%BCr_Architekten_und_Ingenieure#Leistungsbild' },
          { title: inhalt.werte.vobBVergabeUnd, url: 'https://de.wikipedia.org/wiki/Vergabe-_und_Vertragsordnung_f%C3%BCr_Bauleistungen' },
          { title: 'EU-Bauproduktenverordnung', url: 'https://de.wikipedia.org/wiki/Bauproduktenverordnung' },
          { title: 'Betonieren', url: 'https://de.wikipedia.org/wiki/Betonieren' }
        ]}
        literatur={inhalt.daten["Praxiswissen.literatur"]}
        regelwerke={inhalt.daten["Praxiswissen.regelwerke"]}
        formeln={inhalt.daten["Praxiswissen.formeln"]}
      />
    </div>
  );
}
