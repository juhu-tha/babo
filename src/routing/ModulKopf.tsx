// Kopfbereich eines Fachmoduls: Prüfvermerk, Lernziele, Kurzfassung, Erkundungsauftrag, Rechner-Haftungshinweis.
// Wird per React.lazy geladen (Phase 5, AP 5.4). Die Daten kommen je Modul aus dem virtuellen Modul
// virtual:modul-kopf (Vite-Plugin scripts/modulKopf.ts, AP 5.5): Geladen wird nur der Eintrag des
// aktuellen Moduls (wenige kB) statt aller Lernziele/Kurzfassungen/Erkundungen/Grenzen (~87 kB gzip).
import React from 'react';
import type { TabId } from '../contexts/TabContext';
import { MODUL_KERN } from '../registry/kern';
import { Target, ListChecks, FlaskConical, SlidersHorizontal } from 'lucide-react';
import { CalculatorDisclaimerBanner, RechnerGrenzenListe, hatGrenzen } from '../components/ui/CalculatorDisclaimerBanner';
import { LernzieleMeta, LernzieleZiele } from '../components/ui/ModulLernziele';
import { ErkundungAuftraege } from '../components/ui/ErkundungsAuftrag';
import { KurzfassungPunkte } from '../components/ui/ModulKurzfassung';
import { ModulKopfLeiste, type KopfEintrag } from '../components/ui/ModulKopfLeiste';
import { kopfDatenSofort, ladeKopfDaten } from './modulKopfDaten';
import { PruefVermerk } from '../components/ui/PruefVermerk';
import { pruefvermerkFuer } from '../data/pruefvermerke';
import { TeilmodulNavigation } from '../components/ui/TeilmodulNavigation';

export default function ModulKopf({ activeTab, setActiveTab }: { activeTab: TabId; setActiveTab: (tab: TabId) => void }) {
  // Bereits geladen → sofort rendern; sonst bis zum Eintreffen der (vorgeladenen) Daten suspendieren,
  // damit Kopf und Modulinhalt gemeinsam erscheinen (kein Layoutsprung)
  const daten = kopfDatenSofort(activeTab) ?? React.use(ladeKopfDaten(activeTab));
  const { lernziele, kurzfassung, erkundung, grenzen } = daten;
  const vermerk = pruefvermerkFuer(activeTab);
  const oeffne = (id: string) => setActiveTab(id as TabId);
  const eintraege: KopfEintrag[] = [];
  if (lernziele) eintraege.push({ id: 'lernziele', label: 'Lernziele', icon: <Target size={14} aria-hidden="true" />,
    inhalt: <><LernzieleMeta moduleId={activeTab} daten={lernziele} /><LernzieleZiele daten={lernziele} oeffneModul={oeffne} /></> });
  if (kurzfassung) eintraege.push({ id: 'kurzfassung', label: 'Das Wichtigste', icon: <ListChecks size={14} aria-hidden="true" />,
    inhalt: <KurzfassungPunkte punkte={kurzfassung} /> });
  if (erkundung) eintraege.push({ id: 'ausprobieren', label: 'Ausprobieren',
    icon: <FlaskConical size={14} aria-hidden="true" />, inhalt: <ErkundungAuftraege daten={erkundung} /> });
  if (hatGrenzen(grenzen)) eintraege.push({ id: 'annahmen', label: 'Annahmen des Rechners',
    icon: <SlidersHorizontal size={14} aria-hidden="true" />, inhalt: <RechnerGrenzenListe grenzen={grenzen} /> });
  return (
    <>
      {/* Redaktionsmodell: „fachlich geprüft am … von …“ (Phase 6, AP 6.6); Status „offen“ öffentlich ausgeblendet (27.10.2026) */}
      {vermerk && <PruefVermerk vermerk={vermerk} />}
      {/* aufgeteilte Module (src/registry/teilmodule.ts): „Teil 1 von 2“ mit Links auf alle Teile */}
      <TeilmodulNavigation aktiv={activeTab} oeffne={oeffne} />
      {/* Lernziele, Kurzfassung, Ausprobieren und Annahmen als Schaltflächen nebeneinander (Entscheidung 28.10.2026) */}
      <ModulKopfLeiste key={activeTab} eintraege={eintraege} />
      {/* Haftungshinweis für alle Rechner-Module (Phase 1, AP 1.10); Annahmen und Grenzen stehen in der Kopfleiste */}
      {(MODUL_KERN.get(activeTab)?.typ === 'calculator' || grenzen) && (
        <CalculatorDisclaimerBanner
          className="mb-4"
          customText="Lehr- und Vorbemessungswerkzeug: Die Ergebnisse sind vereinfachte Berechnungen zu Lernzwecken und ersetzen keinen bauaufsichtlichen Nachweis (MVV TB / LBO) und keine Prüfung durch fachkundige Personen. Maßgebende Normausgaben stehen in den Quellen am Modulende."
        />
      )}
    </>
  );
}
