import React, { useState } from 'react';
import RessourcenEmissionen from './RessourcenEmissionen';
import Nawaro from './Nawaro';
import { Globe, Trees } from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';

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

      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <FormulaDerivationBox
        title="Beispiel 1: Biogen gespeichertes CO₂ in 1 m³ Konstruktionsvollholz"
        zielGleichung="m_{CO_2} = \frac{44}{12} \cdot c_f \cdot \frac{\rho_u}{1 + u/100} \cdot V"
        schritte={[
          { titel: 'Darrmasse', erklaerung: 'Nadelholz mit ρ = 500 kg/m³ bei u = 12 % Holzfeuchte:', formel: 'm_{atro} = \\frac{500}{1{,}12} = 446\\,\\text{kg}' },
          { titel: 'Kohlenstoff', erklaerung: 'Kohlenstoffanteil c_f = 0,50 der Darrmasse:', formel: 'm_C = 0{,}50 \\cdot 446 = 223\\,\\text{kg}' },
          { titel: 'CO₂-Äquivalent', erklaerung: 'Umrechnung über die Molmassen 44/12:', formel: 'm_{CO_2} = 223 \\cdot \\frac{44}{12} = 818\\,\\text{kg CO}_2' }
        ]}
        ergebnisHinweis="Der Speicher ist temporär: Bei thermischer Verwertung wird das CO₂ in Modul C3 wieder freigesetzt. In EPD nach DIN EN 15804+A2 erscheint er deshalb als −818 in A1–A3 und +818 in C3/C4."
        normQuelle="DIN EN 16449:2014-07; DIN EN 15804+A2"
      />
      <FormulaDerivationBox
        title="Beispiel 2: Primärenergie-Indikatoren einer EPD lesen"
        zielGleichung="\text{PENRT} = \text{PENRE} + \text{PENRM}"
        schritte={[
          { titel: 'Werte (Lehrbeispiel)', erklaerung: '1 m³ Transportbeton: energetisch genutzt PENRE = 1 050 MJ, stofflich gebunden PENRM = 50 MJ (z. B. Zusatzmittel):', formel: '\\text{PENRT} = 1\\,050 + 50 = 1\\,100\\,\\text{MJ}' },
          { titel: 'Umrechnung', erklaerung: '1 kWh = 3,6 MJ:', formel: '\\frac{1\\,100}{3{,}6} = 306\\,\\text{kWh}' },
          { titel: 'Einordnung', erklaerung: 'Das entspricht etwa dem Heizenergiebedarf von 2 m² eines Bestandsgebäudes mit 150 kWh/(m²a) über ein Jahr.', formel: '306 \\approx 2 \\cdot 150' }
        ]}
        ergebnisHinweis="PENRM (stofflich gebundene Energie) ist bei Kunststoffen und Bitumen groß und kann am Lebensende teilweise energetisch genutzt werden; bei mineralischen Baustoffen ist sie vernachlässigbar."
        normQuelle="DIN EN 15804:2022-03 (Indikatoren der Ressourcennutzung)"
      />

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="ressourcen_umwelt" />

      <ModuleFooter 
        lastReviewed="Oktober 2026 (AP 7 Nachhaltigkeit: Indikatoren, biogener Kohlenstoff und Quellen geprüft; fachliche Freigabe durch den Autor ausstehend)" 
        wikipedia={[
          { title: 'Nachwachsender Rohstoff', url: 'https://de.wikipedia.org/wiki/Nachwachsender_Rohstoff' },
          { title: 'Graue Energie', url: 'https://de.wikipedia.org/wiki/Graue_Energie' },
          { title: 'Ökobilanz', url: 'https://de.wikipedia.org/wiki/%C3%96kobilanz' }
        ]}
        literatur={[
          'Hegger, M.; Auch-Schwelk, V.; Fuchs, M.; Rosenkranz, T.: Baustoff Atlas. München: Edition Detail 2005',
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011'
        ]}
        regelwerke={[
          { title: 'DIN EN 15804:2022-03 (Umweltproduktdeklarationen – Grundregeln; EN 15804+A2)' },
          { title: 'ÖKOBAUDAT Plattform (Bundesministerium für Wohnen, Stadtentwicklung und Bauwesen)', url: 'https://www.oekobaudat.de/' },
          { title: 'QNG-Handbuch, Anlage 3 (v1.4, 19.07.2024)', url: 'https://www.qng.info/' },
          { title: 'DIN EN 16449:2014-07 (Holz und Holzprodukte – Berechnung des biogenen Kohlenstoffgehalts)' }
        ]}
        formeln={[
          {
            formel: '\\text{PENRT} = \\text{PENRE} + \\text{PENRM} \\quad [\\text{MJ}], \\quad \\text{PERT} = \\text{PERE} + \\text{PERM} \\quad [\\text{MJ}]',
            erklaerung: 'Gesamtprimärenergiebedarf nicht erneuerbar (PENRT) bzw. erneuerbar (PERT) als Summe aus energetischer (E) und stofflicher (M) Nutzung.',
            quelle: 'DIN EN 15804:2022-03'
          },
          {
            formel: 'm_{\\text{CO2,Speicher}} = m_{\\text{atro}} \\cdot 0{,}50 \\cdot \\frac{44}{12} = m_{\\text{atro}} \\cdot 1{,}833 \\quad [\\text{kg CO}_2]',
            erklaerung: 'In biogenen Rohstoffen (Holz, Hanf, Flachs) gespeicherte Menge Kohlendioxid aus dem C-Gehalt von ca. 50 Gew.-% der atro-Masse.',
            quelle: 'DIN EN 16449:2014-07'
          }
        ]}
      />
    </div>
  );
}
