import { useState, useMemo } from 'react';
import {
  Sliders,
  Calculator,
  BookOpen,
  Activity,
  ShieldCheck,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { InlineMath } from 'react-katex';
import { ModuleTabs, type ModulTab } from '@/src/components/ui/ModuleTabs';
import { betonkennwerte } from '@/src/calc/betonkennwerte';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { EC2_CONCRETE_CLASSES } from './betonkennwerte/daten';
import RechnerTab from './betonkennwerte/RechnerTab';
import TabelleTab from './betonkennwerte/TabelleTab';
import ZeitTheorieTab from './betonkennwerte/ZeitTheorieTab';
import PraxisTab from './betonkennwerte/PraxisTab';
import Ausblick2025Tab from './betonkennwerte/Ausblick2025Tab';
import TestTab from './betonkennwerte/TestTab';
import inhalt from '@/content/betonkennwerte/Betonkennwerte.json';
import { MdText } from '@/src/components/inhalt/MdText';
export { EC2_CONCRETE_CLASSES } from './betonkennwerte/daten';
export type { ConcreteClassData } from './betonkennwerte/daten';

type BkReiter = 'rechner' | 'tabelle' | 'zeit_theorie' | 'praxis' | 'ausblick2025' | 'test';
const REITER: ModulTab<BkReiter>[] = [
  { id: 'rechner', label: inhalt.texte.t1InteraktiverKennwertrechner, icon: Calculator },
  { id: 'tabelle', label: inhalt.texte.t2Ec2Tabelle3, icon: BookOpen },
  { id: 'zeit_theorie', label: inhalt.texte.t3ZeitverläufeTheorie, icon: Activity },
  { id: 'praxis', label: inhalt.texte.t4IngenieurpraxisGzg, icon: ShieldCheck },
  { id: 'ausblick2025', label: inhalt.texte.t5NeuerungenEc2Gen, icon: Sparkles },
  { id: 'test', label: inhalt.texte.t6Wissenstest, icon: CheckCircle2 },
];

export default function Betonkennwerte() {
  const [activeTab, setActiveTab] = useState<BkReiter>('rechner');

  // Interactive Calculator State
  const [selectedClassIdx, setSelectedClassIdx] = useState<number>(4); // C30/37 (Default)
  const [cementClass, setCementClass] = useState<'S' | 'N' | 'R'>('N');
  const [aggregateType, setAggregateType] = useState<'quarzit' | 'kalkstein' | 'sandstein' | 'basalt'>('quarzit');
  const [relativeHumidity, setRelativeHumidity] = useState<number>(65); // %
  const [areaAc, setAreaAc] = useState<number>(0.20); // m²
  const [perimeterU, setPerimeterU] = useState<number>(1.8); // m
  const [elementHeightH, setElementHeightH] = useState<number>(300); // mm (für Biegezug f_ctm,fl)
  const [curingDaysTs, setCuringDaysTs] = useState<number>(3); // d
  const [loadingAgeT0, setLoadingAgeT0] = useState<number>(28); // d
  const [targetAgeT, setTargetAgeT] = useState<number>(18250); // 50 Jahre (18250 d)
  const [ambientTempT, setAmbientTempT] = useState<number>(20); // °C
  const [axialStressSigmaC, setAxialStressSigmaC] = useState<number>(8.0); // MPa
  const [elementLengthL, setElementLengthL] = useState<number>(12.0); // m

  // Quiz state for Tab 5
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});

  // Selected base class
  const baseConcrete = EC2_CONCRETE_CLASSES[selectedClassIdx];

  // ----------------------------------------------------------------------
  // DETERMINISTISCHE FORMELBERECHNUNG NACH DER REFERENZ-FORMELSAMMLUNG
  // (DIN EN 1992-1-1:2011-01 in Verbindung mit DIN EN 1992-1-1/NA:2013-04)
  // ----------------------------------------------------------------------
  const calcResults = useMemo(() => betonkennwerte({
    fck: baseConcrete.fck,
    zementklasse: cementClass,
    gestein: aggregateType,
    rh: relativeHumidity,
    ac: areaAc,
    u: perimeterU,
    h: elementHeightH,
    ts: curingDaysTs,
    t0: loadingAgeT0,
    t: targetAgeT,
    temperatur: ambientTempT,
    sigmaC: axialStressSigmaC,
    laenge: elementLengthL,
  }), [cementClass, aggregateType, relativeHumidity, areaAc, perimeterU, elementHeightH, curingDaysTs, loadingAgeT0, targetAgeT, ambientTempT, axialStressSigmaC, elementLengthL, baseConcrete]);

  // Quiz-Fragen zur Überprüfung (Stufe 4 des Lehrpfads)
  const QUIZ_ITEMS = inhalt.daten["Betonkennwerte.QUIZ_ITEMS"];

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto px-4 py-2">
      
      {/* 1. Header & Lead Box */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-home-grau/20">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-shiraz/10 text-shiraz">
                <Sliders size={22} />
              </span>
              <h2 className="text-xl md:text-2xl font-bold text-text-main"><MdText text={inhalt.texte.betonkennwerteNachEurocode2} /></h2>
            </div>
            <p className="text-xs text-text-main/60 mt-1"><MdText text={inhalt.texte.vollständigeBerechnungMechanischerZeitab} /></p>
          </div>
          <div className="flex items-center gap-2 bg-off-white px-3 py-1.5 rounded-xl border border-home-grau/25 text-xs">
            <span className="font-bold text-slate-700">Normengeneration:</span>
            <span className="font-mono text-shiraz font-semibold"><MdText text={inhalt.texte.ec220112013Ec2} /></span>
          </div>
        </div>

        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-4 leading-relaxed">
          <p><MdText text={inhalt.texte.dieBerechnungSämtlicherKennwerte} /></p>
        </div>
      </div>

      {/* 4-Stufen-Lehrpfad: Reiter (AP 2.8) */}
      <ModuleTabs label="Lehrpfad Betonkennwerte" tabs={REITER} aktiv={activeTab} onWechsel={setActiveTab} className="[&>[role=tablist]]:mb-8">
      {/* ===================================================================== */}
      {/* TAB 1: INTERAKTIVER EC2 KENNWERTRECHNER                               */}
      {/* ===================================================================== */}
      {activeTab === 'rechner' && <RechnerTab aggregateType={aggregateType} ambientTempT={ambientTempT} areaAc={areaAc} axialStressSigmaC={axialStressSigmaC} baseConcrete={baseConcrete} calcResults={calcResults} cementClass={cementClass} curingDaysTs={curingDaysTs} elementHeightH={elementHeightH} elementLengthL={elementLengthL} loadingAgeT0={loadingAgeT0} perimeterU={perimeterU} relativeHumidity={relativeHumidity} selectedClassIdx={selectedClassIdx} setAggregateType={setAggregateType} setAmbientTempT={setAmbientTempT} setAreaAc={setAreaAc} setAxialStressSigmaC={setAxialStressSigmaC} setCementClass={setCementClass} setCuringDaysTs={setCuringDaysTs} setElementHeightH={setElementHeightH} setElementLengthL={setElementLengthL} setLoadingAgeT0={setLoadingAgeT0} setPerimeterU={setPerimeterU} setRelativeHumidity={setRelativeHumidity} setSelectedClassIdx={setSelectedClassIdx} targetAgeT={targetAgeT} />}

      {/* ===================================================================== */}
      {/* TAB 2: VOLLSTÄNDIGE EC2 TABELLE 3.1 MATRIX                            */}
      {/* ===================================================================== */}
      {activeTab === 'tabelle' && <TabelleTab selectedClassIdx={selectedClassIdx} setSelectedClassIdx={setSelectedClassIdx} />}

      {/* ===================================================================== */}
      {/* TAB 3: THEORETISCHE GRUNDLAGEN & ZEITFUNKTIONEN                       */}
      {/* ===================================================================== */}
      {activeTab === 'zeit_theorie' && <ZeitTheorieTab />}

      {/* ===================================================================== */}
      {/* TAB 4: INGENIEURPRAXIS & GRENZZUSTÄNDE (GZG / GZT)                    */}
      {/* ===================================================================== */}
      {activeTab === 'praxis' && <PraxisTab />}

      {/* ===================================================================== */}
      {/* TAB 5: AUSBLICK EUROCODE 2 DER 2. GENERATION (2025/2026)              */}
      {/* ===================================================================== */}
      {activeTab === 'ausblick2025' && <Ausblick2025Tab baseConcrete={baseConcrete} calcResults={calcResults} />}

      {/* ===================================================================== */}
      {/* TAB 6: WISSENSTEST & SELBSTKONTROLLE (STUFE 4)                       */}
      {/* ===================================================================== */}
      {activeTab === 'test' && <TestTab QUIZ_ITEMS={QUIZ_ITEMS} quizAnswers={quizAnswers} setQuizAnswers={setQuizAnswers} />}
      </ModuleTabs>

      {/* 5. Standardisierter Modul-Footer (DIN-Normen OHNE LINKS gemäß System-Direktive) */}
      <ModuleFooter 
        regelwerke={inhalt.daten["Betonkennwerte.regelwerke"]}
        literatur={inhalt.daten["Betonkennwerte.literatur"]}
        formeln={
          activeTab === 'rechner' || activeTab === 'zeit_theorie'
            ? inhalt.daten.Betonkennwerte
            : []
        }
      />
    </div>
  );
}
