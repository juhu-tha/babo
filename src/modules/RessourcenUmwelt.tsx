import React, { useState } from 'react';
import RessourcenEmissionen from './RessourcenEmissionen';
import Nawaro from './Nawaro';
import { Globe, Trees } from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import inhalt from '@/content/ressourcenumwelt/RessourcenUmwelt.json';
import { MdText } from '@/src/components/inhalt/MdText';

export default function RessourcenUmwelt() {
  const [activeTab, setActiveTab ] = useState<'RessourcenEmissionen' | 'Nawaro'>('RessourcenEmissionen');

  const tabs = [
    { id: 'RessourcenEmissionen' as const, label: inhalt.werte.ressourcenverbrauchEmissionen, icon: Globe },
    { id: 'Nawaro' as const, label: inhalt.werte.nachwachsendeRohstoffeNawaro, icon: Trees }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-sm border border-home-grau/30 overflow-hidden">
        <div className="border-b border-home-grau/30 p-6 bg-slate-50/50">
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
            <Globe className="w-5 h-5 text-shiraz" /><MdText text={inhalt.texte.umweltindikatorenNachwachsendeMaterialie} /></h2>
          <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-4">
            <p><MdText text={inhalt.texte.analyseStofflicherVerbräucheCo2} /></p>
          </div>
        </div>

        <div className="p-4 bg-slate-50/50 border-b border-home-grau/30">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button aria-pressed={isActive}
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
        title={inhalt.werte.beispiel1BiogenGespeichertes}
        zielGleichung="m_{CO_2} = \frac{44}{12} \cdot c_f \cdot \frac{\rho_u}{1 + u/100} \cdot V"
        schritte={inhalt.daten["RessourcenUmwelt.schritte"]}
        ergebnisHinweis={inhalt.werte.derSpeicherIstTemporär}
        normQuelle={inhalt.werte.dinEn164492014}
      />
      <FormulaDerivationBox
        title={inhalt.werte.beispiel2PrimärenergieIndikatoren}
        zielGleichung="\text{PENRT} = \text{PENRE} + \text{PENRM}"
        schritte={inhalt.daten["RessourcenUmwelt.schritte_2"]}
        ergebnisHinweis={inhalt.werte.penrmStofflichGebundeneEnergie}
        normQuelle={inhalt.werte.dinEn158042022}
      />

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="ressourcen_umwelt" />

      <ModuleFooter 
        lastReviewed={inhalt.werte.oktober2026Ap7} 
        wikipedia={[
          { title: inhalt.werte.nachwachsenderRohstoff, url: 'https://de.wikipedia.org/wiki/Nachwachsender_Rohstoff' },
          { title: inhalt.werte.graueEnergie, url: 'https://de.wikipedia.org/wiki/Graue_Energie' },
          { title: 'Ökobilanz', url: 'https://de.wikipedia.org/wiki/%C3%96kobilanz' }
        ]}
        literatur={inhalt.daten["RessourcenUmwelt.literatur"]}
        regelwerke={inhalt.daten["RessourcenUmwelt.regelwerke"]}
        formeln={inhalt.daten["RessourcenUmwelt.formeln"]}
      />
    </div>
  );
}
