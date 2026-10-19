import React, { useState } from 'react';
import Lebensdauern from './Lebensdauern';
import LCC from './LCC';
import Preisentwicklung from './Preisentwicklung';
import { Clock, Coins, TrendingUp } from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';

export default function LebenszyklusKosten() {
  const [activeTab, setActiveTab ] = useState<'Lebensdauern' | 'LCC' | 'Preisentwicklung'>('Lebensdauern');

  const tabs = [
    { id: 'Lebensdauern' as const, label: 'Bauteillebensdauern', icon: Clock },
    { id: 'LCC' as const, label: 'Lebenszykluskosten (LCC)', icon: Coins },
    { id: 'Preisentwicklung' as const, label: 'Baukostenentwicklung', icon: TrendingUp }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-sm border border-home-grau/30 overflow-hidden">
        <div className="border-b border-home-grau/30 p-6 bg-slate-50/50">
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
            <Coins className="w-5 h-5 text-shiraz" />
            Lebenszykluskosten (LCC) &amp; Bauteillebensdauern
          </h2>
          <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-4">
            <p>
              Berechnung nach Barwertmethode (Kapitalwert), Lebensdauerprognosen über BNB-Referenzen und historische/aktuelle Entwicklung der Realbaupreise in Deutschland.
            </p>
          </div>
        </div>

        <div className="p-4 bg-slate-50/50 border-b border-home-grau/30">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`p-4 rounded-xl border transition-all duration-200 flex flex-col items-center justify-center gap-2 text-center h-full cursor-pointer ${
                    isActive 
                      ? 'bg-shiraz/5 border-shiraz text-shiraz font-bold shadow-sm' 
                      : 'bg-white border-home-grau/30 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <Icon size={20} className={isActive ? 'text-shiraz' : 'text-slate-500'} />
                  <span className="text-sm font-semibold leading-tight">
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'Lebensdauern' && <Lebensdauern />}
          {activeTab === 'LCC' && <LCC />}
          {activeTab === 'Preisentwicklung' && <Preisentwicklung />}
        </div>
      </div>

      <ModuleFooter 
        wikipedia={[
          { title: 'Lebenszykluskostenrechnung', url: 'https://de.wikipedia.org/wiki/Lebenszykluskostenrechnung' },
          { title: 'Barwert', url: 'https://de.wikipedia.org/wiki/Barwert' },
          { title: 'Baupreisindex', url: 'https://de.wikipedia.org/wiki/Baupreisindex' }
        ]}
        literatur={[
          'Pelzeter, A.: Lebenszykluskosten von Immobilien (Bauwerk Verlag)',
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011'
        ]}
        regelwerke={[
          { title: 'DIN EN 15643 (Nachhaltigkeit von Bauwerken - Allgemeine Rahmenbedingungen)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+15643' },
          { title: 'ISO 15686-5 (Buildings and constructed assets - Life cycle costing)', url: 'https://www.iso.org/' },
          { title: 'BNB Leitfaden Nachhaltiges Bauen (Anlage 1: Nutzungsdauern von Bauteilen)', url: 'https://www.nachhaltigesbauen.de/' }
        ]}
        formeln={[
          {
            formel: 'BW = \\sum_{t=0}^{T} \\frac{C_t}{(1 + r)^t} \\quad [\\text{€}]',
            erklaerung: 'Barwertmethode (Net Present Value NPV) der kumulierten Lebenszykluskosten über Betrachtungszeitraum T bei Diskontierungszinssatz r und periodischen Kosten Ct.',
            quelle: 'ISO 15686-5 / DIN EN 16627'
          },
          {
            formel: 'K_{\\text{LCC}} = C_{\\text{Herstellung}} + \\sum_{t=1}^T \\frac{C_{\\text{Betrieb},t} + C_{\\text{Instand},t}}{(1 + r)^t} + \\frac{C_{\\text{Rückbau}} - R_{\\text{Rest}}}{(1 + r)^T}',
            erklaerung: 'Ganzheitliche Lebenszykluskostenstruktur unter Berücksichtigung von Errichtung, Nutzung, periodischer Instandhaltung sowie Restwerten am Lebensdauerende.',
            quelle: 'BNB Modul LCC'
          }
        ]}
      />
    </div>
  );
}
