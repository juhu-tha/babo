// Kopfbereich eines Fachmoduls: Lernziele, Kurzfassung, Erkundungsauftrag, Rechner-Haftungshinweis.
// Wird per React.lazy geladen (Phase 5, AP 5.4). Die Daten kommen je Modul aus dem virtuellen Modul
// virtual:modul-kopf (Vite-Plugin scripts/modulKopf.ts, AP 5.5): Geladen wird nur der Eintrag des
// aktuellen Moduls (wenige kB) statt aller Lernziele/Kurzfassungen/Erkundungen/Grenzen (~87 kB gzip).
import React from 'react';
import type { TabId } from '../contexts/TabContext';
import { MODUL_KERN } from '../registry/kern';
import { CalculatorDisclaimerBanner } from '../components/ui/CalculatorDisclaimerBanner';
import { ModulLernziele } from '../components/ui/ModulLernziele';
import { ErkundungsAuftrag } from '../components/ui/ErkundungsAuftrag';
import { ModulKurzfassung } from '../components/ui/ModulKurzfassung';
import { kopfDatenSofort, ladeKopfDaten } from './modulKopfDaten';

export default function ModulKopf({ activeTab, setActiveTab }: { activeTab: TabId; setActiveTab: (tab: TabId) => void }) {
  // Bereits geladen → sofort rendern; sonst bis zum Eintreffen der (vorgeladenen) Daten suspendieren,
  // damit Kopf und Modulinhalt gemeinsam erscheinen (kein Layoutsprung)
  const daten = kopfDatenSofort(activeTab) ?? React.use(ladeKopfDaten(activeTab));
  const { lernziele, kurzfassung, erkundung, grenzen } = daten;
  return (
    <>
      {/* Lernziele je Fachmodul (Phase 3, AP 3.6) */}
      {lernziele && <ModulLernziele moduleId={activeTab} daten={lernziele} oeffneModul={(id) => setActiveTab(id as TabId)} />}
      {/* „Das Wichtigste in 5 Punkten“ vor langen Modulen (Phase 3, AP 3.8) */}
      {kurzfassung && <ModulKurzfassung key={activeTab} punkte={kurzfassung} />}
      {/* Erkundungsauftrag „Ausprobieren“ für Rechner (Phase 3, AP 3.7) */}
      {erkundung && <ErkundungsAuftrag key={activeTab} daten={erkundung} />}
      {/* Haftungshinweis für alle Rechner-Module (Phase 1, AP 1.10) */}
      {(MODUL_KERN.get(activeTab)?.typ === 'calculator' || grenzen) && (
        <CalculatorDisclaimerBanner
          className="mb-4"
          grenzen={grenzen}
          customText="Lehr- und Vorbemessungswerkzeug: Die Ergebnisse sind vereinfachte Berechnungen zu Lernzwecken und ersetzen keinen bauaufsichtlichen Nachweis (MVV TB / LBO) und keine Prüfung durch fachkundige Personen. Maßgebende Normausgaben stehen in den Quellen am Modulende."
        />
      )}
    </>
  );
}
