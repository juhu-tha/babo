import React, { useState } from 'react';
import { Flame, Layers, Activity, BookOpen, ShieldAlert, Cpu } from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import IntegrationVerformungen from './IntegrationVerformungen';
import Hydratation from './Hydratation';
import Praxisbeispiele from './Praxisbeispiele';
import Eigenspannungen from './Eigenspannungen';
import KriechenSchwinden from './KriechenSchwinden';
import MassigeBauteile from './MassigeBauteile';
import HydratationRissberechnung from './HydratationRissberechnung';
import HydratationPruefverfahren from './HydratationPruefverfahren';

export default function HydratationFolgen() {
  const [activeTab, setActiveTab] = useState<'IntegrationVerformungen' | 'Hydratation' | 'Praxisbeispiele' | 'Eigenspannungen' | 'KriechenSchwinden' | 'MassigeBauteile' | 'HydratationRissberechnung' | 'HydratationPruefverfahren'>('IntegrationVerformungen');

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <Flame className="text-shiraz" /> Hydratation, Reife &amp; Verformungen
        </h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-3 leading-relaxed">
          <p>
            Exotherme Reaktionswärmeentwicklung, Festigkeitsentwicklung (Reifegradmodell), Eigenspannungen sowie zeitabhängige Verformungsmechanismen durch Schwinden, Kriechen und Bauteilzwang nach Eurocode 2 und DAfStb-Richtlinien.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 pb-3 border-b border-home-grau/20 my-6">
          <button 
            onClick={() => setActiveTab('IntegrationVerformungen')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'IntegrationVerformungen' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
          >
            <BookOpen size={16} /> Übersicht &amp; Zusammenhänge
          </button>
          <button 
            onClick={() => setActiveTab('Hydratation')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'Hydratation' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
          >
            <Activity size={16} /> 1. Hydratation &amp; Reife
          </button>
          <button 
            onClick={() => setActiveTab('Praxisbeispiele')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'Praxisbeispiele' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
          >
            <ShieldAlert size={16} /> 2. Zwang &amp; Risse
          </button>
          <button 
            onClick={() => setActiveTab('HydratationRissberechnung')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'HydratationRissberechnung' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
          >
            <Cpu size={16} /> Präziser Rissnachweis (EC2)
          </button>
          <button 
            onClick={() => setActiveTab('Eigenspannungen')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'Eigenspannungen' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
          >
            <Flame size={16} /> 3. Eigenspannungen
          </button>
          <button 
            onClick={() => setActiveTab('KriechenSchwinden')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'KriechenSchwinden' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
          >
            <Layers size={16} /> 4. Kriechen &amp; Schwinden
          </button>
          <button 
            onClick={() => setActiveTab('MassigeBauteile')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'MassigeBauteile' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
          >
            <Layers size={16} /> Massige Bauteile
          </button>
          <button 
            onClick={() => setActiveTab('HydratationPruefverfahren')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'HydratationPruefverfahren' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
          >
            <Activity size={16} /> Labor-Prüfverfahren
          </button>
        </div>

        <div>
          {activeTab === 'IntegrationVerformungen' && <IntegrationVerformungen />}
          {activeTab === 'Hydratation' && <Hydratation />}
          {activeTab === 'Praxisbeispiele' && <Praxisbeispiele />}
          {activeTab === 'HydratationRissberechnung' && <HydratationRissberechnung />}
          {activeTab === 'Eigenspannungen' && <Eigenspannungen />}
          {activeTab === 'KriechenSchwinden' && <KriechenSchwinden />}
          {activeTab === 'MassigeBauteile' && <MassigeBauteile />}
          {activeTab === 'HydratationPruefverfahren' && <HydratationPruefverfahren />}
        </div>
      </div>

      <ModuleFooter 
        wikipedia={[
          { title: 'Hydratation (Zement)', url: 'https://de.wikipedia.org/wiki/Hydratation_(Zement)' },
          { title: 'Schwinden', url: 'https://de.wikipedia.org/wiki/Schwinden_(Beton)' },
          { title: 'Kriechen', url: 'https://de.wikipedia.org/wiki/Kriechen' }
        ]}
        literatur={[
          'Neville, A. M.: Properties of Concrete (Prentice Hall)',
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011'
        ]}
        regelwerke={[
          { title: 'DIN EN 1992-1-1 (Eurocode 2: Bemessung von Stahlbetonbauteilen - Anhang B)', url: 'https://www.dinmedia.de/dynamic/dinmedia-de/erweiterte-suche-smf/1270466!algolia-search?searchAreaId=1&query=DIN+EN+1992-1-1' },
          { title: 'DAfStb-Richtlinie Massige Bauteile aus Beton', url: 'https://www.dafstb.de/' },
          { title: 'DIN EN 196-8 / DIN EN 196-9 (Prüfverfahren für Zement - Hydratationswärme)', url: 'https://www.dinmedia.de/dynamic/dinmedia-de/erweiterte-suche-smf/1270466!algolia-search?searchAreaId=1&query=DIN+EN+196-8' }
        ]}
        formeln={[
          {
            formel: 'M(t) = \\sum_{i} \\left(T_i - T_0\\right) \\cdot \\Delta t_i \\quad [^{\\circ}\\text{C}\\cdot\\text{h}]',
            erklaerung: 'Reifegrad M(t) nach Saul-Nurse zur Prognose der zeit- und temperaturabhängigen Festigkeitsentwicklung des Betons.',
            quelle: 'ASTM C1074 / DIN EN 13670'
          },
          {
            formel: '\\varepsilon_{\\text{tot}}(t, t_0) = \\varepsilon_{ci}(t_0) + \\varepsilon_{cc}(t, t_0) + \\varepsilon_{cs}(t, t_s) + \\varepsilon_{cT}(t)',
            erklaerung: 'Gesamtdehnung von jungem Beton infolge elastischer Lastbeanspruchung εci, zeitabhängigem Kriechen εcc, Trocknungs- und autogenem Schwinden εcs sowie thermischer Kontraktion εcT.',
            quelle: 'DIN EN 1992-1-1 Kap. 3.1.4'
          }
        ]}
      />
    </div>
  );
}
