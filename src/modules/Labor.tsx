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
  BookOpen,
  ArrowUpFromLine
} from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
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
    { id: 'protokolle', label: 'Prüfprotokolle', icon: <FileText size={15} />, badge: 'DAkkS' },
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
            Digital Testing Center
          </span>
        </div>

        {/* Introductory Teaser Box */}
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-3 leading-relaxed">
          <p>
            <strong>Willkommen im interaktiven Baustofflabor!</strong> Führen Sie normgerechte experimentelle Prüfungen durch, analysieren Sie Spannungs-Dehnungs-Kurven unter uniaxialem Druck, Spaltzug und 4-Punkt-Biegung, simulieren Sie zerstörungsfreie Härteprüfungen (ZfP) mit dem Schmidt-Hammer oder testen Sie rheologische Frischbeton- und Bitumenparameter. Alle Prüfergebnisse lassen sich digital mit Prüfprotokoll und SHA-256 Integritäts-Hash archivieren.
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

      {/* Standardized Module Footer with Comprehensive Academic & Normative References */}
      <ModuleFooter
        wikipedia={[
          { title: 'Werkstoffprüfung', url: 'https://de.wikipedia.org/wiki/Werkstoffpr%C3%BCfung' },
          { title: 'Haftzugprüfung (Abreißversuch)', url: 'https://de.wikipedia.org/wiki/Abrei%C3%9Fversuch' },
          { title: 'Druckfestigkeit', url: 'https://de.wikipedia.org/wiki/Druckfestigkeit' },
          { title: 'Biegezugfestigkeit', url: 'https://de.wikipedia.org/wiki/Biegezugfestigkeit' },
          { title: 'Spaltzugversuch', url: 'https://de.wikipedia.org/wiki/Spaltzugversuch' },
          { title: 'Rückprallhammer', url: 'https://de.wikipedia.org/wiki/R%C3%BCckprallhammer' },
          { title: 'Ausbreitmaß', url: 'https://de.wikipedia.org/wiki/Ausbreitma%C3%9F' }
        ]}
        regelwerke={[
          { title: 'DIN EN 1542:1999-07 (Produkte und Systeme für den Schutz und die Instandsetzung von Betontragwerken - Messung der Haftfestigkeit durch Abreißversuch)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+1542' },
          { title: 'TR Instandhaltung:2020-05 (DIBt) / DAfStb-Richtlinie Schutz und Instandsetzung von Betonbauteilen (SIB)', url: 'https://www.dibt.de/' },
          { title: 'DIN EN 12390-3:2019-08 (Prüfung von Festbeton - Teil 3: Druckfestigkeit von Probekörpern)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+12390-3' },
          { title: 'DIN EN 12390-5:2019-10 (Prüfung von Festbeton - Teil 5: Biegezugfestigkeit von Probekörpern)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+12390-5' },
          { title: 'DIN EN 12390-6:2024-04 (Prüfung von Festbeton - Teil 6: Spaltzugfestigkeit von Probekörpern)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+12390-6' },
          { title: 'DIN EN 12390-13:2021-09 (Prüfung von Festbeton - Teil 13: Bestimmung des Elastizitätsmoduls unter Druck)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+12390-13' },
          { title: 'DIN EN 12504-2:2021-11 (Prüfung von Beton in Bauwerken - Teil 2: Zerstörungsfreie Prüfung: Bestimmung der Rückprallzahl)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+12504-2' },
          { title: 'DIN EN 13791:2020-02 (Bewertung der Druckfestigkeit von Beton in Bauwerken oder in Bauwerksteilen)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+13791' },
          { title: 'DIN EN 12350-2:2019-09 (Prüfung von Frischbeton - Teil 2: Setzmaß / Slump)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+12350-2' },
          { title: 'DIN EN 12350-5:2019-09 (Prüfung von Frischbeton - Teil 5: Ausbreitmaß)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+12350-5' },
          { title: 'DIN EN ISO 6892-1:2020-06 (Metallische Werkstoffe - Zugversuch bei Raumtemperatur)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+ISO+6892-1' },
          { title: 'DIN EN 408:2012-10 (Holzbauwerke - Bestimmung einiger physikalischer und mechanischer Eigenschaften)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+408' },
          { title: 'DIN EN 1426:2015-08 (Bitumen und bitumenhaltige Bindemittel - Bestimmung der Nadelpenetration)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+1426' }
        ]}
        literatur={[
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011',
          'Bargel, H.-J.; Schulze, G. (2018): Werkstoffkunde (12. Auflage, Springer Vieweg)',
          'Neville, A. M. (2011): Properties of Concrete (5th Edition, Pearson)',
          'Grübl, P.; Weigler, H.; Karl, S. (2001): Beton - Arten, Herstellung und Eigenschaften (Ernst & Sohn)'
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
            erklaerung: 'Spaltzugfestigkeit (Brasilianischer Test): Analytische Lösung nach Timoshenko für einen zylindrischen Probekörper unter Linienlast F.',
            quelle: 'DIN EN 12390-6'
          },
          {
            formel: 'f_{ct,fl} = \\frac{F \\cdot L}{b \\cdot h^2}',
            erklaerung: 'Biegezugfestigkeit bei 4-Punkt-Biegung (Drittelpunktsbelastung): Im mittleren Drittel herrscht ein reines Biegemoment M = F·L/6 bei verschwindender Querkraft V = 0.',
            quelle: 'DIN EN 12390-5'
          },
          {
            formel: 'E_c = \\frac{\\sigma_a - \\sigma_b}{\\varepsilon_a - \\varepsilon_b}',
            erklaerung: 'Statistischer Sekanten-Elastizitätsmodul: Verhältnis der Spannungsdifferenz zwischen oberer Prüfspannung (ca. 1/3 der Druckfestigkeit) und Basisspannung zur zugehörigen Dehnungsdifferenz.',
            quelle: 'DIN EN 12390-13'
          },
          {
            formel: 'f_{c,\\alpha} = \\frac{f_{c,0} \\cdot f_{c,90}}{f_{c,0} \\cdot \\sin^2\\alpha + f_{c,90} \\cdot \\cos^2\\alpha}',
            erklaerung: 'Hankinson-Gleichung zur Beschreibung der Festigkeitsanisotropie von Holz bei beliebigem Faserwinkel α.',
            quelle: 'DIN EN 1995-1-1 / DIN EN 408'
          },
          {
            formel: '\\tau(\\dot{\\gamma}) = \\tau_0 + \\mu_p \\cdot \\dot{\\gamma}',
            erklaerung: 'Bingham-Modell für Frischbeton: Schubspannung τ in Abhängigkeit von Fließgrenze τ0, plastischer Viskosität μp und Schergeschwindigkeit γ̇.',
            quelle: 'DIN EN 12350-5'
          }
        ]}
      />
    </div>
  );
}
