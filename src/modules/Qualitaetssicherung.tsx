import React, { useState } from 'react';
import { ClipboardCheck, Award, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import QualitaetssicherungGrundlagen from './QualitaetssicherungGrundlagen';
import Betonbauklassen from './Betonbauklassen';
import Konformitaetskontrolle from './Konformitaetskontrolle';
import CscZertifizierung from './CscZertifizierung';

export default function Qualitaetssicherung() {
  const [activeTab, setActiveTab] = useState<'QualitaetssicherungGrundlagen' | 'Betonbauklassen' | 'Konformitaetskontrolle' | 'CscZertifizierung'>('QualitaetssicherungGrundlagen');

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <ClipboardCheck className="text-shiraz" /> Qualitätssicherung &amp; Konformitätswesen
        </h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-3 leading-relaxed">
          <p>
            Systematische Gütesicherung im Betonbau: Werkseigene Produktionskontrolle (WPK), Konformitätsprüfung nach Kriterien 1 und 2 gemäß DIN EN 206, Betonbauqualitätsklassen (BBQ) und internationale CSC-Nachhaltigkeitszertifizierung.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 pb-3 border-b border-home-grau/20 my-6">
          <button 
            onClick={() => setActiveTab('QualitaetssicherungGrundlagen')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'QualitaetssicherungGrundlagen' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
          >
            <ClipboardCheck size={16} /> Qualitätssicherung
          </button>
          <button 
            onClick={() => setActiveTab('Betonbauklassen')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'Betonbauklassen' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
          >
            <ShieldCheck size={16} /> Betonbauklassen (BBQ)
          </button>
          <button 
            onClick={() => setActiveTab('Konformitaetskontrolle')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'Konformitaetskontrolle' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
          >
            <CheckCircle2 size={16} /> Konformitätskontrolle
          </button>
          <button 
            onClick={() => setActiveTab('CscZertifizierung')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'CscZertifizierung' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
          >
            <Award size={16} /> CSC-Zertifizierung
          </button>
        </div>

        <div>
          {activeTab === 'QualitaetssicherungGrundlagen' && <QualitaetssicherungGrundlagen />}
          {activeTab === 'Betonbauklassen' && <Betonbauklassen />}
          {activeTab === 'Konformitaetskontrolle' && <Konformitaetskontrolle />}
          {activeTab === 'CscZertifizierung' && <CscZertifizierung />}
        </div>
      </div>

      <ModuleFooter 
        wikipedia={[
          { title: 'Qualitätssicherung', url: 'https://de.wikipedia.org/wiki/Qualit%C3%A4tssicherung' },
          { title: 'Konformitätsbewertung', url: 'https://de.wikipedia.org/wiki/Konformit%C3%A4tsbewertung' },
          { title: 'Transportbeton', url: 'https://de.wikipedia.org/wiki/Transportbeton' }
        ]}
        literatur={[
          'Lohaus, L.; Weimann, M.: Handbuch Betonprüfung: Anleitung zur Durchführung von Prüfungen an Frisch- und Festbeton (Verlag Bau+Technik)',
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011'
        ]}
        regelwerke={[
          { title: 'DIN EN 206 / DIN 1045-2 (Beton - Festlegung, Eigenschaften, Herstellung und Konformität)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+206' },
          { title: 'DIN EN 13670 / DIN 1045-3 (Ausführung von Tragwerken aus Beton)', url: 'https://www.dinmedia.de/de/suche?q=DIN+EN+13670' },
          { title: 'DBV-Merkblatt Betonbauqualitätsklassen (BBQ)', url: 'https://www.betonverein.de/' },
          { title: 'CSC Technical Manual (Concrete Sustainability Council)' }
        ]}
        formeln={[
          {
            formel: 'f_{cm} \\ge f_{ck} + 4 \\quad [\\text{N/mm}^2] \\quad \\text{und} \\quad f_{ci} \\ge f_{ck} - 4 \\quad [\\text{N/mm}^2]',
            erklaerung: 'Konformitätskriterium 1 und 2 für die Erstherstellung bzw. Stichprobenprüfung von 3 Einzelergebnissen nach DIN EN 206 Tabelle 14.',
            quelle: 'DIN EN 206 Abs. 8.2.1.2'
          },
          {
            formel: 's = \\sqrt{\\frac{\\sum_{i=1}^n (x_i - \\bar{x})^2}{n - 1}} \\le s_{\\text{grenz}} \\quad [\\text{N/mm}^2]',
            erklaerung: 'Standardabweichung s der Druckfestigkeitsergebnisse zur kontinuierlichen Beurteilung der Produktionspräzision in der werkseigenen Produktionskontrolle (WPK).',
            quelle: 'DIN EN 206 Abs. 8.2.1.3'
          }
        ]}
      />
    </div>
  );
}
