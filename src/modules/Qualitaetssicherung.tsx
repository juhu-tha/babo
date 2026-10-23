import React, { useState } from 'react';
import { ClipboardCheck, Award, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import QualitaetssicherungGrundlagen from './QualitaetssicherungGrundlagen';
import Betonbauklassen from './Betonbauklassen';
import Konformitaetskontrolle from './Konformitaetskontrolle';
import CscZertifizierung from './CscZertifizierung';

type QsReiter = 'QualitaetssicherungGrundlagen' | 'Betonbauklassen' | 'Konformitaetskontrolle' | 'CscZertifizierung';

// Empfohlene Reihenfolge (Lernpfad)
const LERNPFAD: { id: QsReiter; label: string }[] = [
  { id: 'QualitaetssicherungGrundlagen', label: 'Qualitätssicherung' },
  { id: 'Betonbauklassen', label: 'Betonbauklassen (BBQ)' },
  { id: 'Konformitaetskontrolle', label: 'Konformitätskontrolle' },
  { id: 'CscZertifizierung', label: 'CSC-Zertifizierung' },
];

export default function Qualitaetssicherung() {
  const [activeTab, setActiveTab] = useState<QsReiter>('QualitaetssicherungGrundlagen');
  const pos = LERNPFAD.findIndex(s => s.id === activeTab);
  const naechster = pos >= 0 && pos < LERNPFAD.length - 1 ? LERNPFAD[pos + 1] : null;

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-home-grau/30">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
          <ClipboardCheck className="text-shiraz" /> Qualitätssicherung &amp; Konformitätswesen
        </h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-3 leading-relaxed">
          <p>
            Gütesicherung im Betonbau: werkseigene Produktionskontrolle (WPK), Konformitätskriterien für die Druckfestigkeit nach DIN EN 206 / DIN 1045-2, Betonbauqualitätsklassen (BBQ) nach DIN 1045-1000 und CSC-Nachhaltigkeitszertifizierung. Empfohlene Reihenfolge: von links nach rechts.
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

        {naechster && (
          <div className="flex justify-end mt-6">
            <button
              onClick={() => { setActiveTab(naechster.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="px-4 py-2 rounded-xl text-sm font-bold border border-home-grau/30 bg-white hover:bg-off-white text-text-main flex items-center gap-2 cursor-pointer"
            >
              Weiter: {naechster.label} <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>

      <FormulaDerivationBox
        title="Anwendungsbeispiel: Konformität bei stetiger Herstellung (C30/37)"
        zielGleichung="f_{cm} \ge f_{ck} + 1{,}48 \cdot \sigma \quad \text{und} \quad f_{ci} \ge f_{ck} - 4"
        normQuelle="DIN EN 206, Abschnitt 8.2.1 i. V. m. DIN 1045-2 (σ ≥ 3 N/mm²)"
        schritte={[
          { titel: '1. Gegeben', formel: 'f_{ck,cube} = 37\\,\\text{N/mm}^2,\\; n = 15,\\; s = 2{,}5\\,\\text{N/mm}^2', erklaerung: 'Würfelprüfung, 15 Ergebnisse aus dem Beurteilungszeitraum.' },
          { titel: '2. Standardabweichung ansetzen', formel: '\\sigma = \\max(s;\\,3{,}0) = 3{,}0\\,\\text{N/mm}^2', erklaerung: 'Der Rechenwert darf 3 N/mm² nicht unterschreiten.' },
          { titel: '3. Mittelwert-Kriterium', formel: 'f_{cm} \\ge 37 + 1{,}48 \\cdot 3{,}0 = 41{,}4\\,\\text{N/mm}^2', erklaerung: 'Mindestmittelwert der 15 Ergebnisse.' },
          { titel: '4. Einzelwert-Kriterium', formel: 'f_{ci} \\ge 37 - 4 = 33\\,\\text{N/mm}^2', erklaerung: 'Gilt für jedes Einzelergebnis.' },
        ]}
        ergebnisHinweis="Konform, wenn f_cm ≥ 41,4 N/mm² und kein Einzelwert unter 33 N/mm² liegt."
      />

      <ModulTest moduleId="qualitaetssicherung" />

      <ModuleFooter
        weblinks={[
          { title: 'Beton.wiki: Übereinstimmungsnachweis', url: 'https://beton.wiki/index.php?title=Konformit%C3%A4t' },
          { title: 'Beton.wiki: BetonBauQualität', url: 'https://beton.wiki/index.php?title=BetonBauQualit%C3%A4t' },
          { title: 'Concrete Sustainability Council (CSC)', url: 'https://csc.eco/' },
          { title: 'Baunetz Wissen: Zertifizierung des CSC', url: 'https://www.baunetzwissen.de/beton/fachwissen/herstellung/zertifizierung-des-concrete-sustainability-councils-8430745' },
          { title: 'DGNB-Kriterium ENV1.3 (Neubau, Version 2023)', url: 'https://www.dgnb.de/filestorages/Downloads_unprotected/dokumente/kriterien/dgnb-kriterium-env-1-3-gebaeude-neubau-version-2023.pdf' }
        ]}
        wikipedia={[
          { title: 'Qualitätssicherung', url: 'https://de.wikipedia.org/wiki/Qualit%C3%A4tssicherung' },
          { title: 'Konformitätsbewertung', url: 'https://de.wikipedia.org/wiki/Konformit%C3%A4tsbewertung' },
          { title: 'Transportbeton', url: 'https://de.wikipedia.org/wiki/Transportbeton' },
          { title: 'Weiße Wanne', url: 'https://de.wikipedia.org/wiki/Wei%C3%9Fe_Wanne' }
        ]}
        literatur={[
          'Grübl, P.; Weigler, H.; Karl, S.: Beton – Arten, Herstellung und Eigenschaften. Berlin: Ernst & Sohn 2001',
          'Lohmeyer, G.; Ebeling, K.: Weiße Wannen – einfach und sicher. Düsseldorf: Verlag Bau+Technik 2018',
          'Verein Deutscher Zementwerke (Hrsg.): Zement-Taschenbuch. 51. Ausgabe, Düsseldorf: Verlag Bau+Technik 2008',
          'Neroth, G.; Vollenschaar, D. (Hrsg.): Wendehorst Baustoffkunde. 27. Aufl., Wiesbaden: Vieweg+Teubner 2011'
        ]}
        regelwerke={[
          { title: 'DIN EN 206:2021-06 / DIN 1045-2:2023-08 (Beton – Festlegung, Eigenschaften, Herstellung und Konformität)' },
          { title: 'DIN EN 13670 / DIN 1045-3:2023-08 (Bauausführung, Überwachungsklassen)' },
          { title: 'DIN 1045-1000:2023-08 (Grundlagen und Betonbauqualitätsklassen BBQ)' },
          { title: 'DIN EN 12390-3:2019-10 (Druckfestigkeit von Probekörpern)' },
          { title: 'CSC Technical Manual, Version 3.0 (2025-12)' }
        ]}
        formeln={[
          {
            formel: 'f_{cm} \\ge f_{ck} + 4 \\quad \\text{und} \\quad f_{ci} \\ge f_{ck} - 4 \\quad [\\text{N/mm}^2]',
            erklaerung: 'Erstherstellung: mindestens 3 Ergebnisse; Mittelwert und jedes Einzelergebnis prüfen.',
            quelle: 'DIN EN 206, Abschnitt 8.2.1'
          },
          {
            formel: 'f_{cm} \\ge f_{ck} + 1{,}48 \\cdot \\sigma \\quad \\text{und} \\quad f_{ci} \\ge f_{ck} - 4 \\quad [\\text{N/mm}^2]',
            erklaerung: 'Stetige Herstellung: mindestens 15 Ergebnisse; σ als Standardabweichung der Produktion, Rechenwert mindestens 3 N/mm².',
            quelle: 'DIN EN 206, Abschnitt 8.2.1; DIN 1045-2'
          },
          {
            formel: 'n = 1:\\; f_{ci} \\ge f_{ck} - 4; \\quad n = 2\\ldots4:\\; f_{cm} \\ge f_{ck} + 1; \\quad n = 5\\ldots6:\\; f_{cm} \\ge f_{ck} + 2',
            erklaerung: 'Identitätsprüfung auf der Baustelle; zusätzlich gilt für jedes Einzelergebnis f_ci ≥ f_ck − 4.',
            quelle: 'DIN EN 206, Anhang B'
          },
          {
            formel: 's = \\sqrt{\\frac{1}{n-1} \\sum_{i=1}^{n} (f_{ci} - f_{cm})^2} \\quad [\\text{N/mm}^2]',
            erklaerung: 'Empirische Standardabweichung der Prüfserie.',
            quelle: 'DIN EN 206'
          }
        ]}
      />
    </div>
  );
}
