import React, { useState } from 'react';
import RessourcenEmissionen from './RessourcenEmissionen';
import Nawaro from './Nawaro';
import { Globe, Trees } from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';

export default function RessourcenUmwelt() {
  const [activeTab, setActiveTab ] = useState<'RessourcenEmissionen' | 'Nawaro'>('RessourcenEmissionen');

  const tabs = [
    { id: 'RessourcenEmissionen' as const, label: 'Ressourcenverbrauch & Emissionen', icon: Globe },
    { id: 'Nawaro' as const, label: 'Nachwachsende Rohstoffe (NaWaRo)', icon: Trees }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-sm border border-home-grau/30 overflow-hidden">
        <div className="border-b border-home-grau/30 p-6 bg-slate-50/50">
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
            <Globe className="w-5 h-5 text-shiraz" />
            Umweltindikatoren &amp; Nachwachsende Materialien (NaWaRo)
          </h2>
          <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-4">
            <p>
              Analyse stofflicher Verbräuche, CO2-Äquivalente (GWP), Primärenergiebedarf (PENRT/PERT) sowie baustoffliche Eigenschaften biologischer und nachwachsender Baustoffe.
            </p>
          </div>
        </div>

        <div className="p-4 bg-slate-50/50 border-b border-home-grau/30">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`p-4 rounded-xl border transition-all duration-200 flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left h-full cursor-pointer ${
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
          {activeTab === 'RessourcenEmissionen' && <RessourcenEmissionen />}
          {activeTab === 'Nawaro' && <Nawaro />}
        </div>
      </div>

      <ModuleFooter 
        wikipedia={[
          { title: 'Nachwachsender Rohstoff', url: 'https://de.wikipedia.org/wiki/Nachwachsender_Rohstoff' },
          { title: 'Graue Energie', url: 'https://de.wikipedia.org/wiki/Graue_Energie' },
          { title: 'Ökobilanz', url: 'https://de.wikipedia.org/wiki/%C3%96kobilanz' }
        ]}
        literatur={[
          'Hegger, M. et al.: Baustoff-Atlas (Edition Detail / Birkhäuser)',
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011'
        ]}
        regelwerke={[
          { title: 'DIN EN 15804 (Nachhaltigkeit von Bauwerken - Umweltproduktdeklarationen)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+15804' },
          { title: 'ÖKOBAUDAT Plattform (Bundesministerium für Wohnen, Stadtentwicklung und Bauwesen)', url: 'https://www.oekobaudat.de/' },
          { title: 'QNG Kriterien (Qualitätssiegel Nachhaltiges Gebäude)', url: 'https://www.nachhaltigesbauen.de/' }
        ]}
        formeln={[
          {
            formel: '\\text{PENRT} = \\text{PENRE} + \\text{PENRM} \\quad [\\text{MJ}], \\quad \\text{PERT} = \\text{PERE} + \\text{PERM} \\quad [\\text{MJ}]',
            erklaerung: 'Gesamtprimärenergiebedarf nicht erneuerbar (PENRT) bzw. erneuerbar (PERT) als Summe aus energetischer (E) und stofflicher (M) Nutzung.',
            quelle: 'DIN EN 15804 Tabelle 5'
          },
          {
            formel: 'm_{\\text{CO2,Speicher}} = m_{\\text{atro}} \\cdot 0{,}50 \\cdot \\frac{44}{12} = m_{\\text{atro}} \\cdot 1{,}833 \\quad [\\text{kg CO}_2]',
            erklaerung: 'In biogenen Rohstoffen (Holz, Hanf, Flachs) gespeicherte Menge Kohlendioxid aus dem C-Gehalt von ca. 50 Gew.-% der atro-Masse.',
            quelle: 'DIN EN 16449'
          }
        ]}
      />
    </div>
  );
}
