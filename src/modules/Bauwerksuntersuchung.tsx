import React, { useState } from 'react';
import { Search, Eye, Activity, Hammer, ArrowRight, BookOpen, ClipboardCheck, Layers } from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { useTabContext } from '@/src/contexts/TabContext';
import PruefverfahrenKatalog from './bauwerksuntersuchung/PruefverfahrenKatalog';
import ProbenahmePlaner from './bauwerksuntersuchung/ProbenahmePlaner';
import InterpretationNavigator from './bauwerksuntersuchung/InterpretationNavigator';
import { Scale } from 'lucide-react';

import type { TabId } from '@/src/contexts/TabContext';
import inhalt from '@/content/bauwerksuntersuchung/Bauwerksuntersuchung.json';
import { MdText } from '@/src/components/inhalt/MdText';
import { ModuleTabs, type ModulTab } from '@/src/components/ui/ModuleTabs';
import { AuswahlGruppe, alsOption } from '../components/ui/Auswahlgruppe';
const ZfP = React.lazy(() => import('./ZfP'));

type UntersuchungReiter = 'diagnose' | 'probenahme' | 'interpretation' | 'katalog' | 'zfp';
const REITER: readonly ModulTab<UntersuchungReiter>[] = [
  { id: 'diagnose', label: 'Diagnose-Phasen', icon: Search },
  { id: 'probenahme', label: inhalt.texte.prüfumfangKonditionierung, icon: ClipboardCheck },
  { id: 'interpretation', label: inhalt.texte.interpretationAnwendung, icon: Scale },
  { id: 'katalog', label: inhalt.texte.prüfkatalog14Verf, icon: Layers },
  { id: 'zfp', label: inhalt.texte.dgzfpAusbildung, icon: Activity },
];

// Aufteilung in drei Teilmodule (28.10.2026, src/registry/teilmodule.ts): Reiter → Route des Teilmoduls.
// Die Routen übergeben ihre Reiter über `bereiche` (src/routing/ModulInhalt.tsx).
export const UNTERSUCHUNG_TEIL: Readonly<Record<UntersuchungReiter, TabId>> = {
  diagnose: 'bauwerksdiagnose', probenahme: 'bauwerksdiagnose', interpretation: 'bauwerksdiagnose',
  katalog: 'pruefverfahren_katalog', zfp: 'zfp',
};
// Zielreiter beim Wechsel ins andere Teilmodul (z. B. „Alle Prüfverfahren im Detailkatalog“)
let naechsterReiter: UntersuchungReiter | undefined;

export default function Bauwerksuntersuchung({ bereiche }: { bereiche: readonly UntersuchungReiter[] }) {
  const { setActiveTab } = useTabContext();
  const reiter = REITER.filter(r => bereiche.includes(r.id));
  const [subTab, setSubTab] = useState<UntersuchungReiter>(() => {
    const start = naechsterReiter && bereiche.includes(naechsterReiter) ? naechsterReiter : bereiche[0];
    naechsterReiter = undefined;
    return start;
  });
  const [activeStep, setActiveStep] = useState<number>(1);

  // Reiter dieses Teilmoduls direkt zeigen, sonst das andere Teilmodul mit diesem Reiter öffnen
  const zeigeBereich = (id: UntersuchungReiter) => {
    if (bereiche.includes(id)) { setSubTab(id); return; }
    naechsterReiter = id;
    setActiveTab(UNTERSUCHUNG_TEIL[id]);
  };

  const stepsDetails = [
    {
      id: 1,
      title: inhalt.werte.t1RecherchePlanungArchivrecherche,
      icon: BookOpen,
      color: "blue",
      desc: inhalt.werte.dasFundamentJederErfolgreichen,
      bullets: inhalt.daten["Bauwerksuntersuchung.stepsDetails.0.bullets"],
      standards: inhalt.daten["Bauwerksuntersuchung.stepsDetails.0.standards"],
      linkText: inhalt.werte.zumZustandsbewertungsModulVdi,
      linkTab: "vdi6200"
    },
    {
      id: 2,
      title: inhalt.werte.t2VisuelleErsterfassungSchadenskartierung,
      icon: Eye,
      color: "orange",
      desc: inhalt.werte.dieHandnaheVisuelleBegutachtung,
      bullets: inhalt.daten["Bauwerksuntersuchung.stepsDetails.1.bullets"],
      standards: inhalt.daten["Bauwerksuntersuchung.stepsDetails.1.standards"],
      linkText: inhalt.werte.klassischeBauschadensbilderAnalysieren,
      linkTab: "schadensbilder"
    },
    {
      id: 3,
      title: inhalt.werte.t3VorOrtMessdiagnostik,
      icon: Activity,
      color: "emerald",
      desc: inhalt.werte.zerstörungsfreiePrüfverfahrenZfpErlauben,
      bullets: inhalt.daten["Bauwerksuntersuchung.stepsDetails.2.bullets"],
      standards: inhalt.daten["Bauwerksuntersuchung.stepsDetails.2.standards"],
      linkText: inhalt.werte.allePrüfverfahrenImDetailkatalog,
      linkTab: "katalog"
    },
    {
      id: 4,
      title: inhalt.werte.t4ZerstörendeErgänzungsprüfungLabor,
      icon: Hammer,
      color: "purple",
      desc: inhalt.werte.zurKalibrierungDerZfp,
      bullets: inhalt.daten["Bauwerksuntersuchung.stepsDetails.3.bullets"],
      standards: inhalt.daten["Bauwerksuntersuchung.stepsDetails.3.standards"],
      linkText: inhalt.werte.zerstörendeLaborprüfverfahrenImDetail,
      linkTab: "katalog"
    }
  ];

  // Inhalt der Bereiche dieses Teilmoduls; die Reiterleiste erscheint nur in Teil 1 mit drei Bereichen,
  // Teil 2 (Katalog) und Teil 3 (ZfP) bestehen aus je einem Bereich (keine Leiste mit nur einem Reiter).
  const bereichsInhalt = (
      <div className="flex flex-col gap-6">

      {bereiche.includes('diagnose') && subTab === 'diagnose' && (
        <>
          {/* Haupt-Einführung */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30 flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Search className="text-shiraz" /><MdText text={inhalt.texte.bauwerksuntersuchungZustandsanalyse} /></h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p><MdText text={inhalt.texte.prüfphasenMesstechnischeDiagnostikUnd} /></p>
        </div>
            </div>
            
            <div className="text-sm text-slate-800 bg-slate-50 p-4 rounded-xl border border-home-grau/30 leading-relaxed">
              <p><MdText text={inhalt.texte.eineUmfassendeBauwerksuntersuchungIst} /></p>
            </div>
          </div>

          {/* Interaktiver Ablaufplaner (Bento-Art) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Linke Auswahlliste */}
            <div className="lg:col-span-5 flex flex-col gap-3">
              <h3 className="text-xs font-bold text-gray-550 uppercase tracking-widest pl-1"><MdText text={inhalt.texte.phasenDerTragwerksdiagnose} /></h3>
              <AuswahlGruppe label="Phase der Tragwerksdiagnose" className="flex flex-col gap-2.5">
                {stepsDetails.map((step) => {
                  const StepIcon = step.icon;
                  const isActive = activeStep === step.id;
                  return (
                    <button {...alsOption(isActive)}
                      key={step.id}
                      onClick={() => setActiveStep(step.id)}
                      className={`w-full p-4 rounded-xl border text-left transition-all flex items-center gap-3.5 relative ${
                        isActive 
                          ? 'bg-shiraz/5 border-shiraz text-shiraz font-bold shadow-sm'
                          : 'bg-white hover:bg-slate-50 border-home-grau/30 text-slate-800'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                        isActive ? 'bg-shiraz text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        <StepIcon size={18} />
                      </div>
                      <div className="flex-1">
                        <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">Schritt {step.id}</span>
                        <span className="text-sm leading-tight block">{step.title.replace(/^\d+\.\s*/, '')}</span>
                      </div>
                      {isActive && (
                        <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-shiraz animate-pulse"></div>
                      )}
                    </button>
                  );
                })}
              </AuswahlGruppe>
            </div>

            {/* Rechte Detailanzeige */}
            <div className="lg:col-span-7">
              {(() => {
                const current = stepsDetails.find(s => s.id === activeStep)!;
                const DetailIcon = current.icon;
                return (
                  <div className="bg-white p-6 rounded-2xl border border-home-grau/30 shadow-sm flex flex-col gap-4 min-h-[380px] justify-between h-full animate-in fade-in zoom-in-95 duration-150">
                    <div>
                      <div className="flex items-center gap-2 pb-3 mb-4 border-b border-home-grau/30">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-shiraz shrink-0">
                          <DetailIcon size={16} />
                        </div>
                        <h3 className="font-bold text-base text-slate-900">{current.title}</h3>
                      </div>

                      <p className="text-sm font-medium text-slate-800 mb-4 leading-relaxed">
                        {current.desc}
                      </p>

                      <div className="space-y-2.5">
                        <span className="text-xs font-bold text-shiraz uppercase tracking-wider block"><MdText text={inhalt.texte.prüfschwerpunkteArbeitsmittel} /></span>
                        <ul className="space-y-2">
                           {current.bullets.map((b, idx) => (
                            <li key={idx} className="text-xs text-slate-600 leading-relaxed flex gap-2 items-start">
                              <span className="text-shiraz select-none font-bold">✔</span>
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {current.standards && (
                        <div className="space-y-2 pt-4 border-t border-slate-100 mt-4 animate-in fade-in duration-300">
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block"><MdText text={inhalt.texte.aktuelleNormenPrüfvorschriften} /></span>
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            {current.standards.map((std, idx) => (
                              <span key={idx} className="px-2 py-1 bg-[#FCF8F2] border border-home-grau/25 text-text-main/90 rounded text-[10px] font-mono leading-tight">
                                {std}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
     
                      {/* Querverweis direkt im Kontext */}
                    <div className="mt-6 pt-4 border-t border-home-grau/30">
                      <button
                        onClick={() => {
                          if (current.linkTab === 'katalog' || current.linkTab === 'zfp') {
                            zeigeBereich(current.linkTab);
                          } else {
                            setActiveTab(current.linkTab as TabId);
                          }
                        }}
                        className="w-full py-2.5 px-4 bg-shiraz hover:bg-shiraz/90 text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 group cursor-pointer shadow-xs"
                      >
                        <span>{current.linkText}</span>
                        <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>

          </div>

          {/* Querverweise / Vernetzungsknotenpunkt (Static links for full linkage) */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-dashed border-home-grau/30">
            <h3 className="font-bold text-sm text-slate-800 mb-3 flex items-center gap-2">
              <ClipboardCheck className="text-slate-600 w-5 h-5" /><MdText text={inhalt.texte.gebäudediagnostikÜbersichtVerknüpfterWis} /></h3>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed"><MdText text={inhalt.texte.umfangreicheBauwerksdiagnostikErfordertS} /></p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <button
                onClick={() => setActiveTab('vdi6200')}
                className="p-3 bg-white hover:bg-slate-100 border border-home-grau/30 hover:border-shiraz/40 rounded-xl text-left transition-all cursor-pointer flex flex-col gap-1"
              >
                <span className="font-bold text-xs text-slate-800">Regelwerke</span>
                <span className="text-xs text-slate-500"><MdText text={inhalt.texte.zustandsbewertungNachDin1076} /></span>
              </button>
              <button
                onClick={() => zeigeBereich('katalog')}
                className="p-3 bg-white hover:bg-slate-100 border border-home-grau/30 hover:border-shiraz/40 rounded-xl text-left transition-all cursor-pointer flex flex-col gap-1"
              >
                <span className="font-bold text-xs text-slate-800">Prüfkatalog</span>
                <span className="text-xs text-slate-500"><MdText text={inhalt.texte.alle14VerfahrenIm} /></span>
              </button>
              <button
                onClick={() => setActiveTab('analytik')}
                className="p-3 bg-white hover:bg-slate-100 border border-home-grau/30 hover:border-shiraz/40 rounded-xl text-left transition-all cursor-pointer flex flex-col gap-1"
              >
                <span className="font-bold text-xs text-slate-800">Laboranalytik</span>
                <span className="text-xs text-slate-500"><MdText text={inhalt.texte.röntgendiffraktometrieXrdRemMikroskopie} /></span>
              </button>
              <button
                onClick={() => setActiveTab('schadensbilder')}
                className="p-3 bg-white hover:bg-slate-100 border border-home-grau/30 hover:border-shiraz/40 rounded-xl text-left transition-all cursor-pointer flex flex-col gap-1"
              >
                <span className="font-bold text-xs text-slate-800">Schadensbilder</span>
                <span className="text-xs text-slate-500"><MdText text={inhalt.texte.alkaliKieselsäureReaktionAkr} /></span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* SUBTAB: PROBENAHME & KONDITIONIERUNG (NEU NACH NUTZERANFORDERUNG) */}
      {bereiche.includes('probenahme') && subTab === 'probenahme' && (
        <ProbenahmePlaner />
      )}

      {/* SUBTAB: INTERPRETATION & ANWENDUNG DER ERGEBNISSE (NEU NACH NUTZERANFORDERUNG) */}
      {bereiche.includes('interpretation') && subTab === 'interpretation' && (
        <InterpretationNavigator />
      )}

      {/* SUBTAB: PRÜFVERFAHREN-KATALOG (DETAILGRAD BOHRWIDERSTAND) */}
      {bereiche.includes('katalog') && subTab === 'katalog' && (
        <PruefverfahrenKatalog />
      )}

      {/* SUBTAB 3: DGZfP & ZfP-AUSBILDUNG */}
      {bereiche.includes('zfp') && subTab === 'zfp' && (
        <React.Suspense fallback={<div className="flex justify-center items-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-shiraz"></div></div>}>
          <ZfP />
        </React.Suspense>
      )}
      </div>
  );

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      
      {bereiche.includes('diagnose') ? (
        <ModuleTabs label={inhalt.werte.reiterBereiche} tabs={reiter} aktiv={subTab} onWechsel={setSubTab} className="flex flex-col gap-6 [&>[role=tablist]]:border [&>[role=tablist]]:border-home-grau/30 [&>[role=tablist]]:bg-white [&>[role=tablist]]:p-1 [&>[role=tablist]]:rounded-2xl [&>[role=tablist]]:shadow-sm">
        {bereichsInhalt}
        </ModuleTabs>
      ) : bereichsInhalt}

      {/* Standardisierter ModuleFooter für Bauwerksuntersuchung */}
      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) – gehören zu Teil 1 (Diagnose und Interpretation) */}
      {bereiche.includes('diagnose') && (<>
      <FormulaDerivationBox
        title={inhalt.werte.beispiel1RestnutzungsdauerBis}
        zielGleichung="t_{krit} = \left(\frac{c_{0{,}05}}{k_{carb}}\right)^2"
        schritte={inhalt.daten["Bauwerksuntersuchung.schritte"]}
        ergebnisHinweis={inhalt.werte.dasTGesetzGilt}
        normQuelle={inhalt.werte.dinEn146302007}
      />
      <FormulaDerivationBox
        title={inhalt.werte.beispiel2CharakteristischeIn}
        zielGleichung="f_{ck,is} = \min\left(f_{m,is} - k_n \cdot s;\; f_{is,lowest} + M\right)"
        schritte={inhalt.daten["Bauwerksuntersuchung.schritte_2"]}
        ergebnisHinweis={inhalt.werte.fürDieNachrechnungWird}
        normQuelle={inhalt.werte.dinEn137912020}
      />
      </>)}

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      {bereiche.includes('diagnose') && <ModulTest moduleId="bauwerksdiagnose" />}
      {bereiche.includes('katalog') && <ModulTest moduleId="pruefverfahren_katalog" />}
      {bereiche.includes('zfp') && <ModulTest moduleId="zfp" />}

      <ModuleFooter
        lastReviewed={inhalt.werte.oktober2026Ap8}
        wikipedia={[
          { title: 'Bauwerksdiagnostik', url: 'https://de.wikipedia.org/wiki/Bauwerksdiagnostik' },
          { title: inhalt.werte.zerstörungsfreieWerkstoffprüfung, url: 'https://de.wikipedia.org/wiki/Zerst%C3%B6rungsfreie_Werkstoffpr%C3%BCfung' },
          { title: 'Bohrwiderstandsmessung', url: 'https://de.wikipedia.org/wiki/Bohrwiderstandsmessung' },
          { title: 'Schmidt-Hammer', url: 'https://de.wikipedia.org/wiki/Schmidt-Hammer' }
        ]}
        literatur={inhalt.daten["Bauwerksuntersuchung.literatur"]}
        regelwerke={inhalt.daten["Bauwerksuntersuchung.regelwerke"]}
        formeln={inhalt.daten["Bauwerksuntersuchung.formeln"]}
      />
    </div>
  );
}
