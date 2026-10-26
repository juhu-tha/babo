import React, { useState } from 'react';
import { ClipboardCheck, Award, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { ModuleFooter } from '@/src/components/ui/ModuleFooter';
import { FormulaDerivationBox } from '@/src/components/ui/FormulaDerivationBox';
import { ModulTest } from '@/src/components/quiz/ModulTest';
import QualitaetssicherungGrundlagen from './QualitaetssicherungGrundlagen';
import Betonbauklassen from './Betonbauklassen';
import Konformitaetskontrolle from './Konformitaetskontrolle';
import CscZertifizierung from './CscZertifizierung';
import inhalt from '@/content/qualitaetssicherung/Qualitaetssicherung.json';
import { MdText } from '@/src/components/inhalt/MdText';

type QsReiter = 'QualitaetssicherungGrundlagen' | 'Betonbauklassen' | 'Konformitaetskontrolle' | 'CscZertifizierung';

// Empfohlene Reihenfolge (Lernpfad)
const LERNPFAD: { id: QsReiter; label: string }[] = [
  { id: 'QualitaetssicherungGrundlagen', label: 'Qualitätssicherung' },
  { id: 'Betonbauklassen', label: inhalt.werte.betonbauklassenBbq },
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
          <ClipboardCheck className="text-shiraz" /><MdText text={inhalt.texte.qualitätssicherungKonformitätswesen} /></h2>
        <div className="text-sm text-text-main/80 bg-off-white p-4 rounded-xl border border-home-grau/30 mt-3 leading-relaxed">
          <p><MdText text={inhalt.texte.gütesicherungImBetonbauWerkseigene} /></p>
        </div>

        <div className="flex flex-wrap gap-2 pb-3 border-b border-home-grau/20 my-6">
          <button aria-pressed={activeTab === 'QualitaetssicherungGrundlagen'} 
            onClick={() => setActiveTab('QualitaetssicherungGrundlagen')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'QualitaetssicherungGrundlagen' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
          >
            <ClipboardCheck size={16} /> Qualitätssicherung
          </button>
          <button aria-pressed={activeTab === 'Betonbauklassen'} 
            onClick={() => setActiveTab('Betonbauklassen')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'Betonbauklassen' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
          >
            <ShieldCheck size={16} /><MdText text={inhalt.texte.betonbauklassenBbq} /></button>
          <button aria-pressed={activeTab === 'Konformitaetskontrolle'} 
            onClick={() => setActiveTab('Konformitaetskontrolle')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
              activeTab === 'Konformitaetskontrolle' 
                ? 'bg-shiraz text-white border-shiraz shadow-md' 
                : 'bg-white text-text-main border-home-grau/30 hover:bg-off-white hover:text-text-main'
            }`}
          >
            <CheckCircle2 size={16} /> Konformitätskontrolle
          </button>
          <button aria-pressed={activeTab === 'CscZertifizierung'} 
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
        title={inhalt.werte.anwendungsbeispielKonformitätBeiStetiger}
        zielGleichung="f_{cm} \ge f_{ck} + 1{,}48 \cdot \sigma \quad \text{und} \quad f_{ci} \ge f_{ck} - 4"
        normQuelle={inhalt.werte.dinEn206Abschnitt}
        schritte={inhalt.daten["Qualitaetssicherung.schritte"]}
        ergebnisHinweis={inhalt.werte.konformWennFCm}
      />

      <ModulTest moduleId="qualitaetssicherung" />

      <ModuleFooter
        weblinks={[
          { title: inhalt.werte.betonWikiÜbereinstimmungsnachweis, url: 'https://beton.wiki/index.php?title=Konformit%C3%A4t' },
          { title: inhalt.werte.betonWikiBetonbauqualität, url: 'https://beton.wiki/index.php?title=BetonBauQualit%C3%A4t' },
          inhalt.daten["Qualitaetssicherung.weblinks.2"],
          { title: inhalt.werte.baunetzWissenZertifizierungDes, url: 'https://www.baunetzwissen.de/beton/fachwissen/herstellung/zertifizierung-des-concrete-sustainability-councils-8430745' },
          { title: inhalt.werte.dgnbKriteriumEnv13, url: 'https://www.dgnb.de/filestorages/Downloads_unprotected/dokumente/kriterien/dgnb-kriterium-env-1-3-gebaeude-neubau-version-2023.pdf' }
        ]}
        wikipedia={[
          { title: 'Qualitätssicherung', url: 'https://de.wikipedia.org/wiki/Qualit%C3%A4tssicherung' },
          { title: 'Konformitätsbewertung', url: 'https://de.wikipedia.org/wiki/Konformit%C3%A4tsbewertung' },
          { title: 'Transportbeton', url: 'https://de.wikipedia.org/wiki/Transportbeton' },
          { title: 'Weiße Wanne', url: 'https://de.wikipedia.org/wiki/Wei%C3%9Fe_Wanne' }
        ]}
        literatur={inhalt.daten["Qualitaetssicherung.literatur"]}
        regelwerke={inhalt.daten["Qualitaetssicherung.regelwerke"]}
        formeln={inhalt.daten["Qualitaetssicherung.formeln"]}
      />
    </div>
  );
}
