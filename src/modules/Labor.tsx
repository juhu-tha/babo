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

  const tabs: { id: LabMode; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'universal_pruefstand', label: 'Universalprüfmaschine', icon: <Activity size={15} />, badge: 'UTM' },
    { id: 'spaltzug', label: 'Spaltzugversuch', icon: <Split size={15} />, badge: 'DIN EN 12390-6' },
    { id: 'biegezug', label: 'Biegezugprüfung', icon: <Layers size={15} />, badge: 'DIN EN 12390-5' },
    { id: 'haftzug', label: 'Haftzugprüfung', icon: <ArrowUpFromLine size={15} />, badge: 'DIN EN 1542' },
    { id: 'schmidt_hammer', label: 'Rückprallhammer', icon: <Target size={15} />, badge: 'ZfP' },
    { id: 'frischbeton', label: 'Frischbeton & Rheologie', icon: <Waves size={15} />, badge: 'DIN EN 12350' },
    { id: 'bitumen_versuche', label: 'Bitumen-Prüfungen', icon: <Flame size={15} />, badge: 'DIN EN 1426' },
    { id: 'labor_auswertung', label: 'Schadensdiagnostik', icon: <Microscope size={15} />, badge: 'Forensik' },
    { id: 'protokolle', label: 'Prüfprotokolle', icon: <FileText size={15} />, badge: 'Archiv' },
  ];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      
      {/* Main Module Header Container */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2.5">
            <TestTube2 className="text-shiraz" /> Virtuelle Versuche &amp; Baustoffprüflabor
          </h2>
          <span className="text-xs font-mono font-bold text-shiraz bg-shiraz/10 px-3 py-1 rounded-full border border-shiraz/20">
            Digitales Prüflabor
          </span>
        </div>

        {/* Introductory Teaser Box */}
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-3 leading-relaxed">
          <p>
            <strong>Willkommen im interaktiven Baustofflabor!</strong> Führen Sie normgerechte experimentelle Prüfungen durch, analysieren Sie Spannungs-Dehnungs-Kurven unter uniaxialem Druck, Spaltzug und 4-Punkt-Biegung, simulieren Sie zerstörungsfreie Härteprüfungen (ZfP) mit dem Schmidt-Hammer oder testen Sie rheologische Frischbeton- und Bitumenparameter. Die Prüfergebnisse lassen sich als Prüfprotokoll mit einer Prüfsumme (zur Erkennung versehentlicher Änderungen, keine kryptografische Signatur) im Browser archivieren. Die Versuche sind Lehrsimulationen und ersetzen keine Prüfung in einer anerkannten Prüfstelle.
          </p>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex flex-wrap gap-2 pt-4 mt-2 border-t border-home-grau/20">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setLabMode(tab.id)}
              className={`px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 border shadow-xs cursor-pointer ${
                labMode === tab.id
                  ? 'bg-shiraz text-white border-shiraz shadow-sm'
                  : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`text-[9px] font-mono px-1.5 py-0.5 rounded-md ${
                    labMode === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Experiment View Area */}
      <div>
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

      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <div className="flex flex-col gap-6">
        <FormulaDerivationBox
          title="Beispiel 1: Haftzugprüfung an einer Mörtelreprofilierung auswerten"
          zielGleichung="f_h = \frac{4 \cdot F_h}{\pi \cdot d^2}"
          schritte={[
            { titel: 'Gegeben', erklaerung: 'Prüfstempel Ø 50 mm, Abreißkraft F_h = 3,20 kN, Bruchbild: 100 % im Altbeton (Bruchbild A).', formel: 'A = \\frac{\\pi \\cdot 50^2}{4} = 1\\,963\\,\\text{mm}^2' },
            { titel: 'Haftzugfestigkeit', erklaerung: 'Kraft in N bezogen auf die Stempelfläche:', formel: 'f_h = \\frac{3\\,200}{1\\,963} = 1{,}63\\,\\text{N/mm}^2' },
            { titel: 'Belastungsgeschwindigkeit kontrollieren', erklaerung: 'DIN EN 1542 fordert 0,05 MPa/s; bei Ø 50 mm entspricht das etwa:', formel: '0{,}05 \\cdot 1\\,963 \\approx 98\\,\\text{N/s}' },
            { titel: 'Bewertung', erklaerung: 'Bruch im Untergrund: Der Verbund ist fester als der Altbeton. Der Einzelwert liegt über dem üblichen Mittelwert-Richtwert von 1,5 N/mm²; entschieden wird über Mittelwert und kleinsten Einzelwert der Prüfserie.', formel: 'f_h = 1{,}63 \\geq 1{,}5\\,\\text{N/mm}^2' }
          ]}
          ergebnisHinweis="Bricht der Prüfkörper in der Klebefuge (Bruchbild Y) unter dem Anforderungswert, ist der Versuch ungültig und mit neu geklebtem Stempel zu wiederholen."
          normQuelle="DIN EN 1542:1999-07; Anforderungen nach TR Instandhaltung bzw. Planung"
        />
        <FormulaDerivationBox
          title="Beispiel 2: Sekanten-E-Modul aus dem dritten Belastungszyklus"
          zielGleichung="E_{C,S} = \frac{\sigma_a - \sigma_b}{\varepsilon_a - \varepsilon_b}"
          schritte={[
            { titel: 'Prüfspannungen', erklaerung: 'Druckfestigkeit an Begleitzylindern f_c = 38,0 N/mm²; obere Spannung ein Drittel davon, untere Spannung 10 %:', formel: '\\sigma_a = \\frac{38{,}0}{3} = 12{,}7,\\quad \\sigma_b = 3{,}8\\,\\text{N/mm}^2' },
            { titel: 'Messung', erklaerung: 'Im stabilisierten dritten Zyklus beträgt die Dehnungsdifferenz zwischen σ_b und σ_a:', formel: '\\varepsilon_a - \\varepsilon_b = 0{,}270\\,\\text{‰} = 2{,}70 \\cdot 10^{-4}' },
            { titel: 'Ergebnis', erklaerung: 'Stabilisierter Sekantenmodul:', formel: 'E_{C,S} = \\frac{12{,}7 - 3{,}8}{2{,}70 \\cdot 10^{-4}} = 32\\,960\\,\\text{N/mm}^2 \\approx 33{,}0\\,\\text{GPa}' }
          ]}
          ergebnisHinweis="Das entspricht E_cm = 33 GPa für C30/37 nach DIN EN 1992-1-1, Tab. 3.1. Der Anfangsmodul E_C,0 aus der Erstbelastung ist wegen bleibender Verformungen etwas kleiner."
          normQuelle="DIN EN 12390-13:2021-09"
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
          { title: 'Konsistenz (Beton)', url: 'https://de.wikipedia.org/wiki/Konsistenz_(Beton)' }
        ]}
        regelwerke={[
          { title: 'DIN EN 1542:1999-07 (Produkte und Systeme für den Schutz und die Instandsetzung von Betontragwerken - Prüfverfahren - Messung der Haftfestigkeit im Abreißversuch)' },
          { title: 'Technische Regel Instandhaltung von Betonbauwerken (TR Instandhaltung, DIBt) / DAfStb-Richtlinie Instandhaltung von Betonbauteilen', url: 'https://www.dibt.de/' },
          { title: 'DIN EN 12390-3:2019-10 (Prüfung von Festbeton - Teil 3: Druckfestigkeit von Probekörpern)' },
          { title: 'DIN EN 12390-5 (EN 12390-5:2019; Prüfung von Festbeton - Teil 5: Biegezugfestigkeit von Probekörpern)' },
          { title: 'DIN EN 12390-6:2024-05 (Prüfung von Festbeton - Teil 6: Spaltzugfestigkeit von Probekörpern)' },
          { title: 'DIN EN 12390-13:2021-09 (Prüfung von Festbeton - Teil 13: Bestimmung des Elastizitätsmoduls unter Druckbelastung (Sekantenmodul))' },
          { title: 'DIN EN 12504-2:2021-10 (Prüfung von Beton in Bauwerken - Teil 2: Zerstörungsfreie Prüfung: Bestimmung der Rückprallzahl)' },
          { title: 'DIN EN 13791:2020-02 (Bewertung der Druckfestigkeit von Beton in Bauwerken oder in Bauwerksteilen)' },
          { title: 'DIN EN 12350-2 (EN 12350-2:2019; Prüfung von Frischbeton - Teil 2: Setzmaß)' },
          { title: 'DIN EN 12350-5 (EN 12350-5:2019; Prüfung von Frischbeton - Teil 5: Ausbreitmaß)' },
          { title: 'DIN EN ISO 6892-1:2020-06 (Metallische Werkstoffe - Zugversuch bei Raumtemperatur)' },
          { title: 'DIN EN 408:2012-10 (Holzbauwerke - Bestimmung einiger physikalischer und mechanischer Eigenschaften)' },
          { title: 'DIN EN 1426 (EN 1426:2015; Bitumen und bitumenhaltige Bindemittel - Bestimmung der Nadelpenetration)' }
        ]}
        literatur={[
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011',
          'Bargel, H.-J.; Schulze, G. (Hrsg.): Werkstoffkunde. 12. Aufl., Berlin: Springer Vieweg 2018',
          'Neville, A. M.: Properties of Concrete. 5th ed., Harlow: Pearson 2011',
          'Grübl, P.; Weigler, H.; Karl, S.: Beton – Arten, Herstellung und Eigenschaften. 2. Aufl., Berlin: Ernst & Sohn 2001'
        ]}
        formeln={[
          {
            formel: 'f_h = \\frac{F_u}{A} = \\frac{4 \\cdot F_u}{\\pi \\cdot d^2}',
            erklaerung: 'Haftzugfestigkeit (Abreißfestigkeit): Verhältnis der Höchstzugkraft Fu zur kreisrunden Prüffläche A des Prüfstempels mit Durchmesser d (DIN EN 1542).',
            quelle: 'DIN EN 1542 / TR Instandhaltung'
          },
          {
            formel: '\\sigma = \\frac{F}{A_0}',
            erklaerung: 'Spannungsdefinition nach Cauchy: Mechanische Normalspannung als Quotient aus einwirkender Normalkraft F und ursprünglicher Querschnittsfläche A0.',
            quelle: 'DIN EN ISO 6892-1 / DIN EN 12390-3'
          },
          {
            formel: 'f_{ct,sp} = \\frac{2 \\cdot F}{\\pi \\cdot d \\cdot L}',
            erklaerung: 'Spaltzugfestigkeit (Brasilianischer Versuch): Lösung der Elastizitätstheorie für einen Zylinder unter Linienlast F; im Mittelbereich der belasteten Ebene herrscht nahezu konstante Querzugspannung.',
            quelle: 'DIN EN 12390-6'
          },
          {
            formel: 'f_{ct,fl} = \\frac{F \\cdot L}{b \\cdot h^2}',
            erklaerung: 'Biegezugfestigkeit bei 4-Punkt-Biegung (Drittelpunktsbelastung): Im mittleren Drittel herrscht ein reines Biegemoment M = F·L/6 bei verschwindender Querkraft V = 0.',
            quelle: 'DIN EN 12390-5'
          },
          {
            formel: 'E_c = \\frac{\\sigma_a - \\sigma_b}{\\varepsilon_a - \\varepsilon_b}',
            erklaerung: 'Statischer Sekanten-Elastizitätsmodul: Verhältnis der Spannungsdifferenz zwischen oberer Prüfspannung (1/3 der Druckfestigkeit) und unterer Prüfspannung zur zugehörigen Dehnungsdifferenz; E_C,0 bei Erstbelastung, E_C,S nach drei Lastzyklen.',
            quelle: 'DIN EN 12390-13:2021-09'
          },
          {
            formel: 'f_{c,\\alpha} = \\frac{f_{c,0} \\cdot f_{c,90}}{f_{c,0} \\cdot \\sin^2\\alpha + f_{c,90} \\cdot \\cos^2\\alpha}',
            erklaerung: 'Hankinson-Gleichung zur Beschreibung der Festigkeitsanisotropie von Holz bei beliebigem Faserwinkel α.',
            quelle: 'Hankinson (1921); vgl. DIN EN 1995-1-1'
          },
          {
            formel: '\\tau(\\dot{\\gamma}) = \\tau_0 + \\mu_p \\cdot \\dot{\\gamma}',
            erklaerung: 'Bingham-Modell für Frischbeton: Schubspannung τ in Abhängigkeit von Fließgrenze τ0, plastischer Viskosität μp und Schergeschwindigkeit γ̇.',
            quelle: 'Rheologie (Bingham-Modell); vgl. DIN EN 12350-5 für die Konsistenzprüfung'
          }
        ]}
        lastReviewed="Oktober 2026 (AP 4 Labor: Prüfnormen, Simulationsannahmen und Protokollfunktion geprüft; fachliche Freigabe durch den Autor ausstehend)"
      />
    </div>
  );
}
