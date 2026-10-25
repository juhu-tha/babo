// Kopfbereich eines Fachmoduls: Lernziele, Kurzfassung, Erkundungsauftrag, Rechner-Haftungshinweis.
// Wird per React.lazy geladen, damit die umfangreichen Daten (lernziele, erkundung, rechnerGrenzen,
// kurzfassung) nicht im Einstiegs-Chunk liegen (Phase 5, AP 5.4).
import React from 'react';
import type { TabId } from '../contexts/TabContext';
import { MODUL_BY_ID } from '../registry/modules';
import { CalculatorDisclaimerBanner } from '../components/ui/CalculatorDisclaimerBanner';
import { grenzenFuer } from '../data/rechnerGrenzen';
import { LERNZIELE } from '../data/lernziele';
import { ModulLernziele } from '../components/ui/ModulLernziele';
import { ErkundungsAuftrag } from '../components/ui/ErkundungsAuftrag';
import { ModulKurzfassung } from '../components/ui/ModulKurzfassung';
import { KURZFASSUNG } from '../data/kurzfassung';
import { ERKUNDUNG } from '../data/erkundung';

export default function ModulKopf({ activeTab, setActiveTab }: { activeTab: TabId; setActiveTab: (tab: TabId) => void }) {
  return (
    <>
      {/* Lernziele je Fachmodul (Phase 3, AP 3.6) */}
      {LERNZIELE[activeTab] && <ModulLernziele moduleId={activeTab} daten={LERNZIELE[activeTab]} oeffneModul={(id) => setActiveTab(id as TabId)} />}
      {/* „Das Wichtigste in 5 Punkten“ vor langen Modulen (Phase 3, AP 3.8) */}
      {KURZFASSUNG[activeTab] && <ModulKurzfassung key={activeTab} punkte={KURZFASSUNG[activeTab]} />}
      {/* Erkundungsauftrag „Ausprobieren“ für Rechner (Phase 3, AP 3.7) */}
      {ERKUNDUNG[activeTab] && <ErkundungsAuftrag key={activeTab} daten={ERKUNDUNG[activeTab]} />}
      {/* Haftungshinweis für alle Rechner-Module (Phase 1, AP 1.10) */}
      {(MODUL_BY_ID.get(activeTab)?.baum?.typ === 'calculator' || grenzenFuer(activeTab)) && (
        <CalculatorDisclaimerBanner
          className="mb-4"
          grenzen={grenzenFuer(activeTab)}
          customText="Lehr- und Vorbemessungswerkzeug: Die Ergebnisse sind vereinfachte Berechnungen zu Lernzwecken und ersetzen keinen bauaufsichtlichen Nachweis (MVV TB / LBO) und keine Prüfung durch fachkundige Personen. Maßgebende Normausgaben stehen in den Quellen am Modulende."
        />
      )}
    </>
  );
}
