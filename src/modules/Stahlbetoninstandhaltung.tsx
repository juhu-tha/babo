import { useState, useMemo } from 'react';
import {
  Wrench,
  Layers,
  CheckCircle2,
  FileText,
  BookOpen,
  Calculator,
  GitCommit
} from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { CalculatorDisclaimerBanner } from '@/src/components/ui/CalculatorDisclaimerBanner';
import { GruppierteModuleTabs, type ModulTabGruppe } from '@/src/components/ui/GruppierteModuleTabs';
import { chloridAuswertung, rissinjektionPlan } from '@/src/calc/schutzInstandsetzung';
import TrTab from './stahlbetoninstandhaltung/TrTab';
import OsTab from './stahlbetoninstandhaltung/OsTab';
import En1504Tab from './stahlbetoninstandhaltung/En1504Tab';
import ProdukteTab from './stahlbetoninstandhaltung/ProdukteTab';
import FortbildungTab from './stahlbetoninstandhaltung/FortbildungTab';
import RegelwerkeTab from './stahlbetoninstandhaltung/RegelwerkeTab';
import RissinjektionTab from './stahlbetoninstandhaltung/RissinjektionTab';
import ChloridrechnerTab from './stahlbetoninstandhaltung/ChloridrechnerTab';
import inhalt from '@/content/stahlbetoninstandhaltung/Stahlbetoninstandhaltung.json';
import { MdText } from '@/src/components/inhalt/MdText';

type InstandhaltungTab = 'tr' | 'os' | 'en1504' | 'fortbildung' | 'regelwerke' | 'produkte' | 'rissinjektion' | 'chloridrechner';

const instandhaltungGruppen: readonly ModulTabGruppe<InstandhaltungTab>[] = [
  { id: 'regelwerke_gruppe', label: inhalt.werte.regelwerkePrinzipien, icon: BookOpen, mitglieder: [
    { id: 'regelwerke', label: inhalt.werte.regelwerkeImVergleich, icon: BookOpen },
    { id: 'tr', label: inhalt.werte.trInstandhaltungPrinzipien, icon: FileText },
    { id: 'en1504', label: inhalt.werte.dinEn1504Prinzipien, icon: BookOpen },
  ] },
  { id: 'os_gruppe', label: inhalt.werte.oberflächenschutzsystemeOs, icon: Layers, mitglieder: [{ id: 'os', label: inhalt.werte.oberflächenschutzsystemeOs2 }] },
  { id: 'produkte_gruppe', label: inhalt.werte.instandsetzungsprodukteRmPcc, icon: Wrench, mitglieder: [{ id: 'produkte', label: inhalt.werte.instandsetzungsprodukteRmPcc2 }] },
  { id: 'riss_gruppe', label: inhalt.werte.rissinjektionDinEn1504, icon: GitCommit, mitglieder: [{ id: 'rissinjektion', label: inhalt.werte.rissinjektionDinEn15042 }] },
  { id: 'chlorid_gruppe', label: inhalt.werte.chloriddiffusionKks, icon: Calculator, mitglieder: [{ id: 'chloridrechner', label: inhalt.werte.chloriddiffusionKks2 }] },
  { id: 'fortbildung_gruppe', label: inhalt.werte.qualifikationZertifikate, icon: CheckCircle2, mitglieder: [{ id: 'fortbildung', label: inhalt.werte.qualifikationZertifikate2 }] },
];

export function Stahlbetoninstandhaltung() {
  const [activeTab, setActiveTab] = useState<InstandhaltungTab>('regelwerke');
  const [selectedScenario, setSelectedScenario] = useState<string>('standsicherheit');

  // Instandsetzungsprodukte Finder states
  const [productApp, setProductApp] = useState<'wall' | 'deck' | 'balcony' | 'sewage'>('wall');
  const [statikRequired, setStatikRequired] = useState<boolean>(true);

  // Rissinjektions-Rechner states
  const [crackActivity, setCrackActivity] = useState<'ruhend' | 'dynamisch'>('ruhend');
  const [crackMoisture, setCrackMoisture] = useState<'trocken' | 'feucht' | 'drueckend'>('trocken');
  const [crackWidth, setCrackWidth] = useState<number>(0.3); // mm
  const [bauteilDicke, setBauteilDicke] = useState<number>(300); // mm
  const [injektionsZiel, setInjektionsZiel] = useState<'kraftschluessig' | 'dehnfaehig' | 'abdichtend'>('kraftschluessig');

  // Chlorid-Diffusions-Simulator states
  const [chloridCs, setChloridCs] = useState<number>(2.5); // M.-% bezogen auf Zementmasse
  const [diffD, setDiffD] = useState<number>(2.0); // * 10^-12 m²/s
  const [bauteilAlter, setBauteilAlter] = useState<number>(25); // Jahre
  const [betondeckung, setBetondeckung] = useState<number>(35); // mm

  // Chloriddiffusion (Kern: src/calc/schutzInstandsetzung.ts)
  const chloridStats = useMemo(() => chloridAuswertung(chloridCs, diffD, bauteilAlter, betondeckung), [chloridCs, diffD, bauteilAlter, betondeckung]);

  // Computed recommendation for Rissinjektion
  const rissStats = useMemo(() => {
    let harzTyp = '';
    let harzKlasse = '';
    let detailVerfahren = '';
    // Packerabstand ≈ h/2; Verpressdruck 0,08 bar/mm, 12 bis 35 bar: Lehrwert ohne Regelwerksgrundlage für Stahlbetonbauteile
    // (keine Regel der ZTV-ING; maßgebend sind Herstellerangaben und die Planung des sachkundigen Planers) – vorläufig, F-Freigabe
    const { packerSpacingMm, maxPressureBar } = rissinjektionPlan(bauteilDicke);

    if (crackMoisture === 'drueckend') {
      harzTyp = inhalt.werte.t2StufenVerpressung2k;
      harzKlasse = inhalt.werte.d11W;
      detailVerfahren = inhalt.werte.t1StufeHochreaktiverPur;
    } else if (crackActivity === 'dynamisch' || injektionsZiel === 'dehnfaehig') {
      harzTyp = inhalt.werte.polyurethanharzPur;
      harzKlasse = inhalt.werte.klasseDDehnfähigNach;
      detailVerfahren = inhalt.werte.elastomererVerschlussFürTemperatur;
    } else if (injektionsZiel === 'kraftschluessig') {
      if (crackWidth < 0.20) {
        harzTyp = inhalt.werte.niedrigviskosesEpoxidharzEp;
        harzKlasse = inhalt.werte.klasseFKraftübertragendNach;
        detailVerfahren = inhalt.werte.sehrNiedrigeViskosität150;
      } else {
        harzTyp = inhalt.werte.epoxidharzEpOderFeinzementsuspension;
        harzKlasse = inhalt.werte.klasseFKraftübertragendNach2;
        detailVerfahren = inhalt.werte.beiRissbreitenW0;
      }
    } else {
      harzTyp = inhalt.werte.polyacrylatgelPcSchleierinjektion;
      harzKlasse = inhalt.werte.klasseSQuellfähigNach;
      detailVerfahren = inhalt.werte.hydrostrukturgelMitWasserähnlicherViskos;
    }

    return {
      harzTyp,
      harzKlasse,
      detailVerfahren,
      maxPressureBar,
      packerSpacingMm
    };
  }, [crackActivity, crackMoisture, crackWidth, bauteilDicke, injektionsZiel]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-shiraz/10 rounded-xl flex items-center justify-center text-shiraz shrink-0">
            <Wrench size={24} />
          </div>
          <div className="space-y-2 flex-1">
            <h2 className="text-xl font-bold text-text-main flex items-center gap-2"><MdText text={inhalt.texte.instandhaltungImMassivbau} /></h2>
            <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
              <p>
                Dieses Modul bietet eine Übersicht über die Instandsetzungsprinzipien und Schutzsysteme für Massivbau- und Stahlbetonbauwerke nach der 
                <strong><MdText text={inhalt.texte.technischenRichtlinieTrInstandhaltung} /></strong> (ehemals DAfStb-Richtlinie) und der europäischen Norm <strong>DIN EN 1504</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Reiter: 6 thematische Hauptbereiche, Regelwerke mit zweiter Ebene (AP 3.8) */}
      <GruppierteModuleTabs
        label={inhalt.werte.bereicheDerInstandhaltung}
        gruppen={instandhaltungGruppen}
        aktiv={activeTab}
        onWechsel={setActiveTab}
        className="[&>[role=tablist]]:pb-3 [&>[role=tablist]]:border-b [&>[role=tablist]]:border-home-grau/20"
      >

      {/* Content Area */}
      <div className="mt-6">
        
        {/* TR Instandhaltung */}
        {activeTab === 'tr' && <TrTab />}

        {/* OS Systeme */}
        {activeTab === 'os' && <OsTab />}

        {/* DIN EN 1504 */}
        {activeTab === 'en1504' && <En1504Tab />}

        {/* Instandsetzungsprodukte (Mörtelsysteme) */}
        {activeTab === 'produkte' && <ProdukteTab productApp={productApp} setProductApp={setProductApp} setStatikRequired={setStatikRequired} statikRequired={statikRequired} />}

        {/* Fortbildungen / Qualifikationen */}
        {activeTab === 'fortbildung' && <FortbildungTab />}

        {/* Regelwerke im Vergleich (TR vs SIB vs EN 1504) */}
        {activeTab === 'regelwerke' && <RegelwerkeTab selectedScenario={selectedScenario} setSelectedScenario={setSelectedScenario} />}

        {/* --- Tab: Rissinjektion (DIN EN 1504-5 / ZTV-ING) --- */}
        {activeTab === 'rissinjektion' && <RissinjektionTab bauteilDicke={bauteilDicke} crackActivity={crackActivity} crackMoisture={crackMoisture} crackWidth={crackWidth} injektionsZiel={injektionsZiel} rissStats={rissStats} setBauteilDicke={setBauteilDicke} setCrackActivity={setCrackActivity} setCrackMoisture={setCrackMoisture} setCrackWidth={setCrackWidth} setInjektionsZiel={setInjektionsZiel} />}

        {/* --- Tab: Chloriddiffusion & KKS (DIN EN ISO 12696) --- */}
        {activeTab === 'chloridrechner' && <ChloridrechnerTab bauteilAlter={bauteilAlter} betondeckung={betondeckung} chloridCs={chloridCs} chloridStats={chloridStats} diffD={diffD} setBauteilAlter={setBauteilAlter} setBetondeckung={setBetondeckung} setChloridCs={setChloridCs} setDiffD={setDiffD} />}

      </div>
      </GruppierteModuleTabs>
    
      <CalculatorDisclaimerBanner className="my-2" />
      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <FormulaDerivationBox
        title={inhalt.werte.beispiel1SchutzstrombedarfEiner}
        zielGleichung="I = A_s \cdot i_{Schutz}"
        schritte={inhalt.daten["Stahlbetoninstandhaltung.schritte"]}
        ergebnisHinweis={inhalt.werte.derTatsächlicheStromWird}
        normQuelle={inhalt.werte.dinEnIso12696}
      />
      <FormulaDerivationBox
        title={inhalt.werte.beispiel2FüllgutbedarfFür}
        zielGleichung="V = L \cdot w \cdot t \cdot f_V"
        schritte={inhalt.daten["Stahlbetoninstandhaltung.schritte_2"]}
        ergebnisHinweis={inhalt.werte.beiWasserführendenRissenOder}
        normQuelle={inhalt.werte.dinEn15045}
      />

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="instandhaltung" />

      <ModuleFooter
        lastReviewed={inhalt.werte.oktober2026Ap12} 
        weblinks={inhalt.daten["Stahlbetoninstandhaltung.weblinks"]}
        wikipedia={[
          { title: 'Betoninstandsetzung', url: 'https://de.wikipedia.org/wiki/Betoninstandsetzung' },
          { title: 'Oberflächenschutzsystem', url: 'https://de.wikipedia.org/wiki/Oberfl%C3%A4chenschutzsystem' },
          { title: inhalt.werte.kathodischerKorrosionsschutz, url: 'https://de.wikipedia.org/wiki/Kathodischer_Korrosionsschutz' },
          { title: 'Rissinjektion' }
        ]}
        regelwerke={inhalt.daten["Stahlbetoninstandhaltung.regelwerke"]}
        literatur={inhalt.daten["Stahlbetoninstandhaltung.literatur"]}
        formeln={inhalt.daten["Stahlbetoninstandhaltung.formeln"]}
      />
    </div>
  );
}
