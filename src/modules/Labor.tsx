import React, { useState } from 'react';
import {
  Activity,
  Layers,
  Split,
  Target,
  Waves,
  Flame,
  Microscope,
  FileText,
  TestTube2,
  ArrowUpFromLine
} from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { GruppierteModuleTabs, type ModulTabGruppe } from '@/src/components/ui/GruppierteModuleTabs';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import UniversalPruefstand from '@/src/components/labor/UniversalPruefstand';
import Spaltzugversuch from '@/src/components/labor/Spaltzugversuch';
import BiegezugPruefung from '@/src/components/labor/BiegezugPruefung';
import HaftzugPruefung from '@/src/components/labor/HaftzugPruefung';
import SchmidtHammerSimulator from '@/src/components/labor/SchmidtHammerSimulator';
import FrischbetonPruefung from '@/src/components/labor/FrischbetonPruefung';
import BitumenVersuche from './BitumenVersuche';
import LaborAuswertung from '@/src/components/LaborAuswertung';
import { LabProtocolManager } from '@/src/components/LabProtocolManager';
import inhalt from '@/content/labor/Labor.json';
import { MdText } from '@/src/components/inhalt/MdText';

export type LabMode =
  | 'universal_pruefstand'
  | 'spaltzug'
  | 'biegezug'
  | 'haftzug'
  | 'schmidt_hammer'
  | 'frischbeton'
  | 'bitumen_versuche'
  | 'labor_auswertung'
  | 'protokolle';

export default function Labor() {
  const [labMode, setLabMode] = useState<LabMode>('universal_pruefstand');

  const gruppen: readonly ModulTabGruppe<LabMode>[] = [
    { id: 'festigkeit_g', label: 'Festigkeitsprüfungen', icon: Activity, mitglieder: [
      { id: 'universal_pruefstand', label: inhalt.werte.universalprüfmaschineUtm, icon: Activity },
      { id: 'spaltzug', label: inhalt.werte.spaltzugversuchDinEn12390, icon: Split },
      { id: 'biegezug', label: inhalt.werte.biegezugprüfungDinEn12390, icon: Layers },
      { id: 'haftzug', label: inhalt.werte.haftzugprüfungDinEn1542, icon: ArrowUpFromLine },
    ] },
    { id: 'zfp_g', label: inhalt.werte.rückprallhammerZfp, icon: Target, mitglieder: [{ id: 'schmidt_hammer', label: inhalt.werte.rückprallhammerZfp2 }] },
    { id: 'frisch_g', label: inhalt.werte.frischbetonRheologie, icon: Waves, mitglieder: [{ id: 'frischbeton', label: inhalt.werte.frischbetonRheologie2 }] },
    { id: 'bitumen_g', label: inhalt.werte.bitumenPrüfungenDinEn, icon: Flame, mitglieder: [{ id: 'bitumen_versuche', label: inhalt.werte.bitumenPrüfungenDinEn2 }] },
    { id: 'diagnose_g', label: 'Schadensdiagnostik', icon: Microscope, mitglieder: [{ id: 'labor_auswertung', label: 'Schadensdiagnostik' }] },
    { id: 'protokolle_g', label: 'Prüfprotokolle', icon: FileText, mitglieder: [{ id: 'protokolle', label: 'Prüfprotokolle' }] },
  ];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      
      {/* Main Module Header Container */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2.5">
            <TestTube2 className="text-shiraz" /><MdText text={inhalt.texte.virtuelleVersucheBaustoffprüflabor} /></h2>
          <span className="text-xs font-mono font-bold text-shiraz bg-shiraz/10 px-3 py-1 rounded-full border border-shiraz/20"><MdText text={inhalt.texte.digitalesPrüflabor} /></span>
        </div>

        {/* Introductory Teaser Box */}
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-3 leading-relaxed">
          <p><MdText text={inhalt.texte.willkommenImInteraktivenBaustofflabor} /></p>
        </div>

      </div>

      {/* Reiter: 6 Hauptbereiche, mechanische Festigkeitsprüfungen mit zweiter Ebene (AP 3.8) */}
      <GruppierteModuleTabs
        label={inhalt.werte.versucheImBaustoffprüflabor}
        gruppen={gruppen}
        aktiv={labMode}
        onWechsel={setLabMode}
        className="[&>[role=tablist]]:bg-white [&>[role=tablist]]:p-4 [&>[role=tablist]]:rounded-2xl [&>[role=tablist]]:shadow-sm [&>[role=tablist]]:border [&>[role=tablist]]:border-home-grau/30"
      >
      {/* Main Experiment View Area */}
      <div className="mt-6">
        {labMode === 'universal_pruefstand' && (
          <UniversalPruefstand onNavigateToProtocols={() => setLabMode('protokolle')} />
        )}

        {labMode === 'spaltzug' && (
          <Spaltzugversuch onNavigateToProtocols={() => setLabMode('protokolle')} />
        )}

        {labMode === 'biegezug' && (
          <BiegezugPruefung />
        )}

        {labMode === 'haftzug' && (
          <HaftzugPruefung onNavigateToProtocols={() => setLabMode('protokolle')} />
        )}

        {labMode === 'schmidt_hammer' && (
          <SchmidtHammerSimulator />
        )}

        {labMode === 'frischbeton' && (
          <FrischbetonPruefung />
        )}

        {labMode === 'bitumen_versuche' && (
          <BitumenVersuche isEmbedded={true} />
        )}

        {labMode === 'labor_auswertung' && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
            <LaborAuswertung />
          </div>
        )}

        {labMode === 'protokolle' && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
            <LabProtocolManager />
          </div>
        )}
      </div>
      </GruppierteModuleTabs>

      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <div className="flex flex-col gap-6">
        <FormulaDerivationBox
          title={inhalt.werte.beispiel1HaftzugprüfungAn}
          zielGleichung="f_h = \frac{4 \cdot F_h}{\pi \cdot d^2}"
          schritte={inhalt.daten["Labor.schritte"]}
          ergebnisHinweis={inhalt.werte.brichtDerPrüfkörperIn}
          normQuelle={inhalt.werte.dinEn15421999}
        />
        <FormulaDerivationBox
          title={inhalt.werte.beispiel2SekantenE}
          zielGleichung="E_{C,S} = \frac{\sigma_a - \sigma_b}{\varepsilon_a - \varepsilon_b}"
          schritte={inhalt.daten["Labor.schritte_2"]}
          ergebnisHinweis={inhalt.werte.dasEntsprichtECm}
          normQuelle={inhalt.werte.dinEn1239013}
        />
      </div>

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="labor" />

      {/* Standardized Module Footer with Comprehensive Academic & Normative References */}
      <ModuleFooter
        wikipedia={[
          { title: 'Werkstoffprüfung', url: 'https://de.wikipedia.org/wiki/Werkstoffpr%C3%BCfung' },
          { title: 'Druckfestigkeit', url: 'https://de.wikipedia.org/wiki/Druckfestigkeit' },
          { title: 'Biegefestigkeit', url: 'https://de.wikipedia.org/wiki/Biegefestigkeit' },
          { title: 'Zugfestigkeit', url: 'https://de.wikipedia.org/wiki/Zugfestigkeit' },
          { title: 'Rückprallhammer', url: 'https://de.wikipedia.org/wiki/R%C3%BCckprallhammer' },
          { title: inhalt.werte.konsistenzBeton, url: 'https://de.wikipedia.org/wiki/Konsistenz_(Beton)' }
        ]}
        regelwerke={inhalt.daten["Labor.regelwerke"]}
        literatur={inhalt.daten["Labor.literatur"]}
        formeln={inhalt.daten["Labor.formeln"]}
        lastReviewed={inhalt.werte.oktober2026Ap4}
      />
    </div>
  );
}
