import React, { useState } from 'react';
import Zertifizierung from './Zertifizierung';
import Produktsiegel from './Produktsiegel';
import { Award, ShieldCheck } from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';

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

      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <FormulaDerivationBox
        title="Beispiel 1: Gesamterfüllungsgrad und Auszeichnungsstufe nach DGNB"
        zielGleichung="\text{GE} = \sum_j w_j \cdot E_j"
        schritte={[
          { titel: 'Gewichte (Lehrbeispiel)', erklaerung: 'Themenfeldgewichte DGNB Neubau (Version 2018, Lehrbeispiel): Ökologie 22,5 %, Ökonomie 22,5 %, Soziokultur 22,5 %, Technik 15 %, Prozess 12,5 %, Standort 5 %. Aktuelle Version 2023.2: Ökologie, Ökonomie, Soziokultur je 25 %, Technik und Prozess je 10 %, Standort 5 %.', formel: '\\sum_j w_j = 100\\,\\%' },
          { titel: 'Erfüllungsgrade', erklaerung: 'ENV 78 %, ECO 82 %, SOC 75 %, TEC 70 %, PRO 85 %, SITE 60 %:', formel: '0{,}225 \\cdot (78 + 82 + 75) + 0{,}15 \\cdot 70 + 0{,}125 \\cdot 85 + 0{,}05 \\cdot 60' },
          { titel: 'Gesamterfüllungsgrad', erklaerung: 'Summe der gewichteten Themenfelder:', formel: '52{,}9 + 10{,}5 + 10{,}6 + 3{,}0 = 77{,}0\\,\\%' },
          { titel: 'Auszeichnung', erklaerung: 'Platin ab 80 %, Gold ab 65 % (jeweils mit Mindesterfüllungsgraden je Themenfeld):', formel: '65\\,\\% \\le 77{,}0\\,\\% < 80\\,\\% \\Rightarrow \\text{Gold}' }
        ]}
        ergebnisHinweis="Für Platin fehlen 3 Prozentpunkte; am wirksamsten sind die hoch gewichteten Themenfelder Ökologie, Ökonomie und Soziokultur."
        normQuelle="DGNB System Neubau (Version 2018, Lehrbeispiel; aktuelle Marktversion 2023.2, gültig seit 01.10.2026)"
      />
      <FormulaDerivationBox
        title="Beispiel 2: QNG-Prüfung beider Ökobilanz-Indikatoren"
        zielGleichung="\text{GWP} \le 24 \;\wedge\; \text{PENRT} \le 96"
        schritte={[
          { titel: 'Ergebnis der Ökobilanz', erklaerung: 'Wohngebäude, 50 Jahre, bezogen auf m² NRF und Jahr:', formel: '\\text{GWP} = 22{,}8\\,\\text{kg CO}_2\\text{-Äq./(m}^2\\text{a)}, \\quad \\text{PENRT} = 101\\,\\text{kWh/(m}^2\\text{a)}' },
          { titel: 'Prüfung QNG-PLUS', erklaerung: 'Beide Anforderungen müssen gleichzeitig erfüllt sein:', formel: '22{,}8 \\le 24 \\;\\checkmark, \\qquad 101 > 96 \\;\\times' },
          { titel: 'Folgerung', erklaerung: 'Das Siegel wird trotz eingehaltenem GWP verfehlt; PENRT lässt sich vor allem über die Anlagentechnik (Wärmepumpe, PV-Eigenstrom) senken.', formel: '\\Delta\\text{PENRT}_{erf} = 5\\,\\text{kWh/(m}^2\\text{a)}' }
        ]}
        ergebnisHinweis="Typ-III-Deklarationen (EPD nach DIN EN 15804) liefern die Indikatorwerte, Typ-I-Umweltzeichen (z. B. Blauer Engel) dienen im QNG eher dem Nachweis der Schadstoffanforderungen."
        normQuelle="QNG-Handbuch Anlage 3, v1.4 (WG23)"
      />

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="zertifizierung_siegel" />

      <ModuleFooter 
        lastReviewed="Oktober 2026 (AP 7 Nachhaltigkeit: QNG-Anforderungswerte, DGNB-Stufen und Literatur geprüft; fachliche Freigabe durch den Autor ausstehend)" 
        wikipedia={[
          { title: 'Deutsche Gesellschaft für Nachhaltiges Bauen', url: 'https://de.wikipedia.org/wiki/Deutsche_Gesellschaft_f%C3%BCr_Nachhaltiges_Bauen' },
          { title: 'Bewertungssystem Nachhaltiges Bauen für Bundesgebäude', url: 'https://de.wikipedia.org/wiki/Bewertungssystem_Nachhaltiges_Bauen_f%C3%BCr_Bundesgeb%C3%A4ude' },
          { title: 'Umweltsiegel', url: 'https://de.wikipedia.org/wiki/Umweltsiegel' }
        ]}
        literatur={[
          'Bauer, M.; Mösle, P.; Schwarz, M.: Green Building – Leitfaden für nachhaltiges Bauen. 2. Aufl., Berlin: Springer Vieweg 2013',
          'Bundesministerium für Wohnen, Stadtentwicklung und Bauwesen (Hrsg.): Leitfaden Nachhaltiges Bauen. Berlin (aktuelle Fassung)'
        ]}
        regelwerke={[
          { title: 'DGNB System – Kriterienkatalog Gebäude Neubau, Version 2023.2 (2026)', url: 'https://www.dgnb.de/' },
          { title: 'BNB Leitfaden Nachhaltiges Bauen', url: 'https://www.nachhaltigesbauen.de/' },
          { title: 'QNG-Handbuch mit Anlage 3 (Version 1.4 vom 19.07.2024)', url: 'https://www.qng.info/' },
          { title: 'ISO 14024:2018 (Umweltkennzeichnungen und -deklarationen – Typ I); ISO 14025:2006 (Typ III)', url: 'https://www.iso.org/' }
        ]}
        formeln={[
          {
            formel: '\\text{Gesamterfüllungsgrad} = \\sum_{j=1}^m w_j \\cdot E_j \\ge 80\\,\\% \\quad (\\text{DGNB Platin; Gold} \\ge 65\\,\\%)',
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
