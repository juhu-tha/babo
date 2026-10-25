import React, { useState } from 'react';
import LCA from './LCA';
import Nachhaltigkeit from './Nachhaltigkeit';
import InteractiveLCACalc from './InteractiveLCACalc';
import TransportbetonLcaUebung from './lca/TransportbetonLcaUebung';
import IngenieurbauLCA from './lca/IngenieurbauLCA';
import { Leaf, BookOpen, Calculator, FileSpreadsheet, Milestone } from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import { ModuleTabs } from '@/src/components/ui/ModuleTabs';

export type LcaTeil = 'grundlagen' | 'rechner' | 'ingenieurbau' | 'regulatorik';
type LcaTab = 'LCA' | 'InteractiveCalc' | 'Ingenieurbau' | 'TransportbetonExcel' | 'Praxiswerkstatt' | 'Regulatorik';

/** Ökobilanzierung, aufgeteilt in vier Module (AP 3.8): Grundlagen, Rechner & QNG, Ingenieurbau, Rechtsrahmen & Praxis */
const TEILE: Record<LcaTeil, { titel: string; text: React.ReactNode; tabs: { id: LcaTab; label: string; icon: typeof Leaf }[]; moduleId: string }> = {
  grundlagen: {
    titel: 'Ökobilanzierung (LCA): Grundlagen',
    text: <>Normen, Lebenszyklusphasen A bis D und Umweltindikatoren nach <strong>DIN EN 15978</strong> und <strong>DIN EN 15804+A2</strong>, EPD-Musterdatenbank und Studierenden-Leitfaden.</>,
    tabs: [{ id: 'LCA', label: 'Ökobilanzierung (LCA) Grundlagen', icon: BookOpen }],
    moduleId: 'oekobilanz_lca',
  },
  rechner: {
    titel: 'LCA-Rechner & QNG-Nachweis',
    text: <>CO₂-Bilanz von Gebäudevarianten einschließlich Transport (A4) und Modul D, Wandaufbau-Konfigurator, QNG-Nachweis der Lebenszyklus-Treibhausgasemissionen und Excel-Übung Transportbeton.</>,
    tabs: [
      { id: 'InteractiveCalc', label: 'Interaktiver CO₂-Rechner & Modul D', icon: Calculator },
      { id: 'Praxiswerkstatt', label: 'Wandaufbau, QNG-Nachweis & Leitfaden', icon: Leaf },
      { id: 'TransportbetonExcel', label: 'Excel-Übung: Transportbeton (Download)', icon: FileSpreadsheet },
    ],
    moduleId: 'lca_rechner',
  },
  ingenieurbau: {
    titel: 'LCA im Ingenieurbau (DIN EN 17472)',
    text: <>Ökobilanz von Ingenieurbauwerken und Infrastruktur nach <strong>DIN EN 17472</strong>: lange Betrachtungszeiträume, Austauschzyklen (B2 bis B5) und verkehrsbedingte Emissionen (B8).</>,
    tabs: [{ id: 'Ingenieurbau', label: 'DIN EN 17472 (Ingenieurbau & Infrastruktur)', icon: Milestone }],
    moduleId: 'lca_ingenieurbau',
  },
  regulatorik: {
    titel: 'Rechtsrahmen, CRREM & Praxis',
    text: <>Hierarchisches Rechtsrahmen-Kompendium (BauPVO, Green Deal, EPBD, ESPR, CBAM, EU-ETS), CRREM-Dekarbonisierungspfade sowie Praxisbeispiele zu Gebäudetyp E, Urban Mining, Lehmbau und Holz-Hybrid.</>,
    tabs: [{ id: 'Regulatorik', label: 'CRREM, Rechtsrahmen & Praxis', icon: Leaf }],
    moduleId: 'lca_regulatorik',
  },
};

export default function OekobilanzLCA({ teil = 'grundlagen' }: { teil?: LcaTeil }) {
  const t = TEILE[teil];
  const [activeTab, setActiveTab] = useState<LcaTab>(t.tabs[0].id);
  const tabs = t.tabs;
  const inhalt = (
    <div className="p-6">
      {activeTab === 'LCA' && <LCA />}
      {activeTab === 'InteractiveCalc' && <InteractiveLCACalc />}
      {activeTab === 'Ingenieurbau' && <IngenieurbauLCA />}
      {activeTab === 'TransportbetonExcel' && <TransportbetonLcaUebung />}
      {activeTab === 'Praxiswerkstatt' && <Nachhaltigkeit bereiche={['wandkonfigurator', 'qng_nachweis', 'leitfaden']} />}
      {activeTab === 'Regulatorik' && <Nachhaltigkeit bereiche={['crrem_regulatorik', 'praxis_innovationen']} />}
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-sm border border-home-grau/30 overflow-hidden">
        <div className="border-b border-home-grau/30 p-6 bg-slate-50/50">
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Leaf className="w-5 h-5 text-shiraz animate-pulse" />
            {t.titel}
          </h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30">
          <p>{t.text}</p>
        </div>
        </div>

        {tabs.length > 1 ? (
          <ModuleTabs label="Bereiche der Ökobilanzierung" tabs={tabs} aktiv={activeTab} onWechsel={setActiveTab} variante="kachel" className="[&>[role=tablist]]:p-4 [&>[role=tablist]]:bg-slate-50/50 [&>[role=tablist]]:border-b [&>[role=tablist]]:border-home-grau/30">
            {inhalt}
          </ModuleTabs>
        ) : inhalt}
      </div>

      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      {teil === 'grundlagen' && (
      <FormulaDerivationBox
        title="Beispiel: Zementanteil am GWP von 1 m³ Transportbeton"
        zielGleichung="\text{GWP}_{A1\text{–}A3} \approx m_Z \cdot \text{GWP}_Z + \text{GWP}_{\text{Rest}}"
        schritte={[
          { titel: 'Annahmen (Lehrwerte)', erklaerung: 'C30/37 mit 320 kg Zement je m³; GWP CEM I ≈ 0,80, CEM III/A ≈ 0,45 kg CO₂-Äq./kg; Gesteinskörnung, Wasser, Zusatzmittel und Werkstransport pauschal 30 kg CO₂-Äq./m³. Projektwerte stets aus EPD bzw. ÖKOBAUDAT.', formel: 'm_Z = 320\\,\\text{kg/m}^3' },
          { titel: 'CEM I', erklaerung: 'Portlandzement:', formel: '\\text{GWP} = 320 \\cdot 0{,}80 + 30 = 286\\,\\text{kg CO}_2\\text{-Äq./m}^3' },
          { titel: 'CEM III/A', erklaerung: 'Hochofenzement mit etwa 50 % Hüttensand:', formel: '\\text{GWP} = 320 \\cdot 0{,}45 + 30 = 174\\,\\text{kg CO}_2\\text{-Äq./m}^3' },
          { titel: 'Einsparung', erklaerung: 'Relative Minderung durch die Zementwahl:', formel: '\\frac{286 - 174}{286} = 39\\,\\%' }
        ]}
        ergebnisHinweis="Der Zement verursacht 80 bis 90 % des Beton-GWP. Hüttensand ist jedoch begrenzt verfügbar; die Wahl muss Expositionsklasse, Frühfestigkeit und Nachbehandlung (DIN 1045-2) berücksichtigen."
        normQuelle="DIN EN 15804+A2 (EPD-Module A1–A3); Lehrwerte, keine Produktdaten"
      />
      )}
      {teil === 'rechner' && (
      <FormulaDerivationBox
        title="Beispiel: QNG-Nachweis der Lebenszyklus-Treibhausgasemissionen eines Wohngebäudes"
        zielGleichung="\text{GWP}_{\text{spez}} = \frac{\text{GWP}_{\text{Konstruktion}} + \text{GWP}_{\text{Betrieb}}}{\text{NRF} \cdot 50\,\text{a}}"
        schritte={[
          { titel: 'Konstruktion', erklaerung: 'Module A1–A3, B4 (Austausch), C3–C4 für ein Mehrfamilienhaus mit 1 200 m² NRF:', formel: '\\text{GWP}_{\\text{Konstruktion}} = 1\\,050\\,000\\,\\text{kg CO}_2\\text{-Äq.}' },
          { titel: 'Betrieb', erklaerung: 'Modul B6 mit 8 000 kg CO₂-Äq. je Jahr über 50 Jahre:', formel: '\\text{GWP}_{\\text{Betrieb}} = 8\\,000 \\cdot 50 = 400\\,000\\,\\text{kg CO}_2\\text{-Äq.}' },
          { titel: 'Kennwert', erklaerung: 'Bezug auf NRF und Betrachtungszeitraum:', formel: '\\frac{1\\,450\\,000}{1\\,200 \\cdot 50} = 24{,}2\\,\\text{kg CO}_2\\text{-Äq./(m}^2\\text{a)} > 24 \\;(\\text{QNG-PLUS knapp verfehlt})' },
          { titel: 'Holzhybrid-Variante', erklaerung: 'Konstruktion 15 % geringer:', formel: '\\frac{892\\,500 + 400\\,000}{60\\,000} = 21{,}5 \\le 24 \\;(\\text{PLUS}), \\quad > 20 \\;(\\text{PREMIUM nicht erreicht})' }
        ]}
        ergebnisHinweis="Gutschriften aus Modul D dürfen nicht verrechnet werden. Neben dem GWP sind PENRT (≤ 96 bzw. 64 kWh/(m²a)) und die übrigen QNG-Anforderungen (Schadstoffe, Barrierefreiheit u. a.) nachzuweisen."
        normQuelle="QNG-Handbuch Anlage 3, v1.4 (WG23); DIN EN 15978"
      />

      )}

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId={t.moduleId} />

      <ModuleFooter
        lastReviewed="Oktober 2026 (AP 7 Nachhaltigkeit: QNG-Anforderungswerte vereinheitlicht (WG23: 24/20 kg CO₂-Äq./(m² NRF·a)), DIN EN 15978:2026-09 ergänzt, Literatur korrigiert; fachliche Freigabe durch den Autor ausstehend)" 
        wikipedia={[
          { title: 'Ökobilanz', url: 'https://de.wikipedia.org/wiki/%C3%96kobilanz' },
          { title: 'Treibhauspotenzial', url: 'https://de.wikipedia.org/wiki/Treibhauspotenzial' },
          { title: 'Graue Energie', url: 'https://de.wikipedia.org/wiki/Graue_Energie' }
        ]}
        literatur={[
          'Klöpffer, W.; Grahl, B.: Ökobilanz (LCA) – Ein Leitfaden für Ausbildung und Beruf. Weinheim: Wiley-VCH 2009',
          'Hauschild, M. Z.; Rosenbaum, R. K.; Olsen, S. I. (Hrsg.): Life Cycle Assessment – Theory and Practice. Cham: Springer 2018'
        ]}
        normIds={['DIN_EN_15804', 'DIN_EN_15978', 'DIN_EN_17472']}
        regelwerke={[
          { title: 'DIN EN ISO 14040:2021-02 / 14044:2021-02 (Umweltmanagement - Ökobilanz)' },
          { title: 'DIN EN 15804:2022-03 (EN 15804:2012+A2:2019+AC:2021; Umweltproduktdeklarationen – Grundregeln)' },
          { title: 'DIN EN 15978:2026-09 (EN 15978:2026; Bewertung der Umweltqualität von Gebäuden – Methodik; ersetzt DIN EN 15978:2012-10, Übergangsregeln in QNG/DGNB manuell prüfen)' },
          { title: 'DIN EN 17472:2024-06 (Bewertung der Nachhaltigkeit von Ingenieurbauwerken - Berechnungsmethoden)' },
          { title: 'DGNB System Kriterium ENV1.1 \'Klimaschutz und Energie\' (Version 2023.2; in Version 2018: \'Ökobilanz des Gebäudes\')', url: 'https://www.dgnb.de/' },
          { title: 'QNG-Handbuch, Anlage 3 (Version 1.4 vom 19.07.2024): Anforderungswerte Lebenszyklus-THG und PENRT', url: 'https://www.qng.info/' }
        ]}
        weblinks={[
          { title: 'ÖKOBAUDAT Plattform – BMWSB EPD-Datenbank', url: 'https://www.oekobaudat.de/' },
          { title: 'WECOBIS – Ökologisches Baustoffinformationssystem', url: 'https://www.wecobis.de/' },
          { title: 'EC3 Tool – Building Transparency', url: 'https://www.buildingtransparency.org/' }
        ]}
        formeln={[
          {
            formel: 'GWP_{\\text{Bauwerk}} = \\sum_{i} m_i \\cdot \\text{GWP}_i + \\sum_{a=1}^{50} E_a \\cdot f_{\\text{PE,CO2}} \\quad [\\text{kg CO}_2\\text{-eq}]',
            erklaerung: 'Lebenszyklus-Treibhausgasbilanzierung über einen Betrachtungszeitraum von 50 Jahren (QNG, BNB, DGNB) unter Berücksichtigung von grauer Energie (Herstellung A1-A3, Rückbau C3/C4) und Betriebsenergie (Modul B6).',
            quelle: 'DIN EN 15978; QNG; DGNB ENV1.1'
          },
          {
            formel: 'GWP_{\\text{Ing}} = \\frac{\\text{GWP}_{\\text{A1-A5}} + \\sum_{k} \\text{GWP}_{\\text{B2-B5},k} + \\text{GWP}_{\\text{B8}} + \\text{GWP}_{\\text{C1-C4}}}{A_{\\text{Deck}} \\cdot t_{\\text{ref}}} \\quad [\\text{kg CO}_2\\text{-eq/(m}^2\\cdot\\text{a)}]',
            erklaerung: 'Lebenszyklus-Treibhausgasbilanzierung von Ingenieurbauwerken über 80 bis 100 Jahre (DIN EN 1990 Auslegungskategorie 5) unter Berücksichtigung von periodischen Austauschzyklen (Lager, Übergänge, Beläge B2-B5) und verkehrsbedingten Stauemissionen während Baustellen (Modul B8).',
            quelle: 'DIN EN 17472:2024-06'
          }
        ]}
      />
    </div>
  );
}
