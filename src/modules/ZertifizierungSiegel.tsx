import React, { useState } from 'react';
import Zertifizierung from './Zertifizierung';
import Produktsiegel from './Produktsiegel';
import { Award, ShieldCheck } from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';

export default function ZertifizierungSiegel() {
  const [activeTab, setActiveTab ] = useState<'Zertifizierung' | 'Produktsiegel'>('Zertifizierung');

  const tabs = [
    { id: 'Zertifizierung' as const, label: 'Gebäudezertifizierungen', icon: Award },
    { id: 'Produktsiegel' as const, label: 'Produktsiegel & Zertifikate', icon: ShieldCheck }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-sm border border-home-grau/30 overflow-hidden">
        <div className="border-b border-home-grau/30 p-6 bg-slate-50/50">
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
            <Award className="w-5 h-5 text-shiraz" />
            Gebäudezertifizierung &amp; Produktsiegel
          </h2>
          <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-4">
            <p>
              Qualitätssicherung, Nachhaltigkeit und Lebenszyklusbewertungen von der Gebäudeebene (wie DGNB, BNB, QNG) bis hin zu stofflichen Hersteller-Zertifikaten (wie Blaue Engel, CSC).
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
          {activeTab === 'Zertifizierung' && <Zertifizierung />}
          {activeTab === 'Produktsiegel' && <Produktsiegel />}
        </div>
      </div>

      <ModuleFooter 
        wikipedia={[
          { title: 'Deutsche Gesellschaft für Nachhaltiges Bauen', url: 'https://de.wikipedia.org/wiki/Deutsche_Gesellschaft_f%C3%BCr_Nachhaltiges_Bauen' },
          { title: 'Bewertungssystem Nachhaltiges Bauen für Bundesgebäude', url: 'https://de.wikipedia.org/wiki/Bewertungssystem_Nachhaltiges_Bauen_f%C3%BCr_Bundesgeb%C3%A4ude' },
          { title: 'Umweltsiegel', url: 'https://de.wikipedia.org/wiki/Umweltsiegel' }
        ]}
        literatur={[
          'Bauer, M.; Mösle, P.; Schwarz, M.: Green Building - Konzepte für nachhaltige Architektur (Callwey Verlag)',
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011'
        ]}
        regelwerke={[
          { title: 'DGNB Kriterienkatalog Gebäude Neubau', url: 'https://www.dgnb.de/' },
          { title: 'BNB Leitfaden Nachhaltiges Bauen', url: 'https://www.nachhaltigesbauen.de/' },
          { title: 'QNG Handbuch (Qualitätssiegel Nachhaltiges Gebäude)', url: 'https://www.nachhaltigesbauen.de/' },
          { title: 'ISO 14024 (Umweltkennzeichnungen und -deklarationen - Typ I)', url: 'https://www.iso.org/' }
        ]}
        formeln={[
          {
            formel: '\\text{Gesamterfüllungsgrad} = \\sum_{j=1}^m w_j \\cdot E_j \\ge 80\\% \\quad (\\text{DGNB Platin})',
            erklaerung: 'Gewichteter Gesamterfüllungsgrad über die Themenfelder Ökologie, Ökonomie, Soziokulturelles, Technik, Prozess und Standort.',
            quelle: 'DGNB Kriteriensystematik'
          },
          {
            formel: 'E_j = \\frac{\\text{Erreichte Punkte}}{\\text{Maximalpunkte}} \\cdot 100\\%',
            erklaerung: 'Erfüllungsgrad des einzelnen Qualitätskriteriums (z. B. ENV1.1 Ökobilanz, SOC1.2 Innenraumluftqualität).',
            quelle: 'BNB / DGNB Handbuch'
          }
        ]}
      />
    </div>
  );
}
