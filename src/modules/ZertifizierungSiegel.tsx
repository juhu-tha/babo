import React, { useState } from 'react';
import Zertifizierung from './Zertifizierung';
import Produktsiegel from './Produktsiegel';
import { Award, ShieldCheck } from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { ModuleTabs } from '@/src/components/ui/ModuleTabs';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import inhalt from '@/content/zertifizierungsiegel/ZertifizierungSiegel.json';
import { MdText } from '@/src/components/inhalt/MdText';

export default function ZertifizierungSiegel() {
  const [activeTab, setActiveTab ] = useState<'Zertifizierung' | 'Produktsiegel'>('Zertifizierung');

  const tabs = [
    { id: 'Zertifizierung' as const, label: 'Zertifizierungen und Förderungen', icon: Award },
    { id: 'Produktsiegel' as const, label: inhalt.werte.produktsiegelZertifikate, icon: ShieldCheck }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-sm border border-home-grau/30 overflow-hidden">
        <div className="border-b border-home-grau/30 p-6 bg-slate-50/50">
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
            <Award className="w-5 h-5 text-shiraz" /><MdText text={inhalt.texte.gebäudezertifizierungProduktsiegel} /></h2>
          <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-4">
            <p><MdText text={inhalt.texte.qualitätssicherungNachhaltigkeitUndLeben} /></p>
          </div>
        </div>

        <ModuleTabs
          label={inhalt.werte.bereicheZertifizierungSiegel}
          tabs={tabs}
          aktiv={activeTab}
          onWechsel={setActiveTab}
          variante="kachel"
          className="[&>[role=tablist]]:p-4 [&>[role=tablist]]:bg-slate-50/50 dark:[&>[role=tablist]]:bg-slate-800/40 [&>[role=tablist]]:border-b [&>[role=tablist]]:border-home-grau/30 [&>[role=tabpanel]]:p-6"
        >
          {activeTab === 'Zertifizierung' && <Zertifizierung />}
          {activeTab === 'Produktsiegel' && <Produktsiegel />}
        </ModuleTabs>
      </div>

      {/* ANWENDUNGSBEISPIELE (Stufe 3 des Lehrpfads) */}
      <FormulaDerivationBox
        title={inhalt.werte.beispiel1GesamterfüllungsgradUnd}
        zielGleichung="\text{GE} = \sum_j w_j \cdot E_j"
        schritte={inhalt.daten["ZertifizierungSiegel.schritte"]}
        ergebnisHinweis={inhalt.werte.fürPlatinFehlen3}
        normQuelle={inhalt.werte.dgnbSystemNeubauVersion}
      />
      <FormulaDerivationBox
        title={inhalt.werte.beispiel2QngPrüfung}
        zielGleichung="\text{GWP} \le 24 \;\wedge\; \text{PENRT} \le 96"
        schritte={inhalt.daten["ZertifizierungSiegel.schritte_2"]}
        ergebnisHinweis={inhalt.werte.typIiiDeklarationenEpd}
        normQuelle={inhalt.werte.qngHandbuchAnlage3}
      />

      {/* SELBSTTEST (Stufe 4 des Lehrpfads) */}
      <ModulTest moduleId="zertifizierung_siegel" />

      <ModuleFooter 
        lastReviewed={inhalt.werte.oktober2026Ap7} 
        wikipedia={[
          { title: inhalt.werte.deutscheGesellschaftFürNachhaltiges, url: 'https://de.wikipedia.org/wiki/Deutsche_Gesellschaft_f%C3%BCr_Nachhaltiges_Bauen' },
          { title: inhalt.werte.bewertungssystemNachhaltigesBauenFür, url: 'https://de.wikipedia.org/wiki/Bewertungssystem_Nachhaltiges_Bauen_f%C3%BCr_Bundesgeb%C3%A4ude' },
          { title: 'Umweltsiegel', url: 'https://de.wikipedia.org/wiki/Umweltzeichen' }
        ]}
        literatur={inhalt.daten["ZertifizierungSiegel.literatur"]}
        regelwerke={inhalt.daten["ZertifizierungSiegel.regelwerke"]}
        formeln={inhalt.daten["ZertifizierungSiegel.formeln"]}
      />
    </div>
  );
}
