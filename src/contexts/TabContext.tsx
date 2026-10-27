import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { modulPfad, tabAusPfad, tabAusHash } from '../routing/pfad';
import { TAB_ALIASES, MODUL_KERN } from '@/src/registry/kern';
import type { ModulId, AliasId } from '@/src/registry/modules';

// Gültige IDs kommen aus der zentralen Modul-Registry (src/registry/modules.ts)
export type TabId = ModulId | AliasId;

export type TabType = TabId;

interface TabContextType {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  typischeBauschaedenSubTab?: 'feuchtigkeit' | 'risse' | 'korrosion' | 'unvertraeglichkeiten' | 'tief_ingenieurbau' | 'analysator';
  setTypischeBauschaedenSubTab: (subTab: 'feuchtigkeit' | 'risse' | 'korrosion' | 'unvertraeglichkeiten' | 'tief_ingenieurbau' | 'analysator') => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  // Tooltip & Fachbegriffe-Modus
  glossaryTooltipMode: boolean;
  setGlossaryTooltipMode: (enabled: boolean) => void;
  toggleGlossaryTooltipMode: () => void;
  // Formel-Herleitungs-Modus
  formulaDerivationMode: boolean;
  setFormulaDerivationMode: (enabled: boolean) => void;
  toggleFormulaDerivationMode: () => void;
}

const TabContext = createContext<TabContextType | undefined>(undefined);

// Aliase für alte Lesezeichen, Quizverweise und Module: zentral in src/registry/modules.ts
export { TAB_ALIASES };

export function resolveTabId(tab: string): TabId {
  const aliase: Readonly<Record<string, ModulId>> = TAB_ALIASES;
  if (tab in aliase) {
    return aliase[tab];
  }
  return tab as TabId;
}

export function isKnownTab(tab: string): boolean {
  if (!tab) return false;
  const clean = tab.trim().toLowerCase();
  return clean in TAB_ALIASES || (MODUL_KERN.has(clean) && !clean.startsWith('divider_'));
}

/**
 * Modul-ID der aktuellen Adresse (Z52): Pfad /modul/<id>; auf der Startseite / zählt ein alter Hash-Link #<id>
 * (Lesezeichen, QR-Codes in Folien). Unbekannter Pfad → null.
 */
export function tabAusAdresse(ort: Pick<Location, 'pathname' | 'hash'> = window.location): string | null {
  const ausPfad = tabAusPfad(ort.pathname);
  if (ausPfad !== 'start') return ausPfad;
  const ausHash = tabAusHash(ort.hash);
  return ausHash && isKnownTab(ausHash) ? ausHash : 'start';
}

function tabFuerAdresse(): TabId {
  try {
    const tab = tabAusAdresse();
    if (tab && isKnownTab(tab)) return resolveTabId(tab);
  } catch {
    /* ungültige Adresse → Startseite */
  }
  return 'start';
}

function getInitialTab(): TabId {
  // Direktlinks (baustoffboard.de/modul/spannbeton, alt: /#spannbeton) beim ersten Laden berücksichtigen
  return typeof window === 'undefined' ? 'start' : tabFuerAdresse();
}

export function TabProvider({ children, startTab }: { children: ReactNode; /** nur Vorrendern im Build (scripts/vorrendern.ts) */ startTab?: TabId }) {
  // Startzustand aus der Adresse (/modul/<id> bzw. alter Hash-Link), sonst 'start'
  const [activeTabState, setActiveTabState] = useState<TabId>(() => startTab ?? getInitialTab());

  const setActiveTab = (tab: TabId) => {
    const resolved = resolveTabId(tab);
    // inaktive Seiten (INAKTIVE_GRUPPEN in src/registry/modules.ts) fehlen im Kern → Startseite statt Lernpfad
    setActiveTabState(MODUL_KERN.has(resolved) ? resolved : 'start');
  };
  const activeTab = activeTabState;

  const [typischeBauschaedenSubTab, setTypischeBauschaedenSubTab] = useState<'feuchtigkeit' | 'risse' | 'korrosion' | 'unvertraeglichkeiten' | 'tief_ingenieurbau' | 'analysator'>('feuchtigkeit');

  // Tooltip-Modus für komplexe Fachbegriffe (systemweit standardmäßig aktiv)
  const [glossaryTooltipMode, setGlossaryTooltipModeState] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('baustoffboard_tooltip_mode');
      return saved !== null ? saved === 'true' : true; // Standard: immer aktiv
    } catch {
      return true;
    }
  });
  const setGlossaryTooltipMode = (enabled: boolean) => {
    setGlossaryTooltipModeState(enabled);
    try { localStorage.setItem('baustoffboard_tooltip_mode', String(enabled)); } catch {}
  };
  const toggleGlossaryTooltipMode = () => setGlossaryTooltipMode(!glossaryTooltipMode);

  // Formel-Herleitungs-Modus (Schritt-für-Schritt Rechenwege, systemweit standardmäßig eingeklappt, per Klick aufklappbar)
  const [formulaDerivationMode, setFormulaDerivationModeState] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('baustoffboard_derivation_mode');
      return saved !== null ? saved === 'true' : false; // Standard: eingeklappt in allen Modulen und Reitern
    } catch {
      return false;
    }
  });
  const setFormulaDerivationMode = (enabled: boolean) => {
    setFormulaDerivationModeState(enabled);
    try { localStorage.setItem('baustoffboard_derivation_mode', String(enabled)); } catch {}
  };
  const toggleFormulaDerivationMode = () => setFormulaDerivationMode(!formulaDerivationMode);

  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('theme');
      if (saved === 'dark' || saved === 'light') return saved;
    } catch (e) {}
    return 'light';
  });

  const setTheme = (newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
    try {
      localStorage.setItem('theme', newTheme);
    } catch (e) {}
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Adresse nachführen (Z52): erster Lauf ersetzt den Eintrag (alter Hash-Link, Groß-/Kleinschreibung, Alias →
  // kanonischer Pfad), jeder Modulwechsel danach legt einen Verlaufseintrag an (Zurück-Taste)
  const ersterLauf = useRef(true);
  useEffect(() => {
    try {
      const ziel = modulPfad(activeTab);
      const erster = ersterLauf.current;
      ersterLauf.current = false;
      const h = tabAusHash(window.location.hash);
      const modulHash = !!h && isKnownTab(h);
      if (window.location.pathname === ziel && !modulHash) return;
      if (erster) {
        // Anker im Modul (#abschnitt) bleiben erhalten, alte Modul-Hashes (#glas) nicht
        window.history.replaceState(window.history.state, '', ziel + window.location.search + (modulHash ? '' : window.location.hash));
      } else {
        window.history.pushState(null, '', ziel + window.location.search);
      }
    } catch (e) {}
  }, [activeTab]);

  // Zurück/Vor: Modul aus der Adresse übernehmen (ohne neuen Verlaufseintrag, Pfad stimmt dann schon)
  useEffect(() => {
    const beiVerlauf = () => setActiveTabState(tabFuerAdresse());
    // Alte In-App-Links (href="#id", location.hash = 'id') auf Pfad umschreiben; Anker (#abschnitt) unberührt
    const beiHash = () => {
      try {
        const h = tabAusHash(window.location.hash);
        if (!h || !isKnownTab(h)) return;
        const tab = resolveTabId(h);
        window.history.replaceState(null, '', modulPfad(tab) + window.location.search);
        setActiveTabState(tab);
      } catch (e) {}
    };
    window.addEventListener('popstate', beiVerlauf);
    window.addEventListener('hashchange', beiHash);
    return () => {
      window.removeEventListener('popstate', beiVerlauf);
      window.removeEventListener('hashchange', beiHash);
    };
  }, []);

  return (
    <TabContext.Provider value={{ activeTab, setActiveTab, typischeBauschaedenSubTab, setTypischeBauschaedenSubTab, theme, setTheme, toggleTheme, glossaryTooltipMode, setGlossaryTooltipMode, toggleGlossaryTooltipMode, formulaDerivationMode, setFormulaDerivationMode, toggleFormulaDerivationMode }}>
      {children}
    </TabContext.Provider>
  );
}

export function useTabContext() {
  const context = useContext(TabContext);
  if (context === undefined) {
    throw new Error('useTabContext must be used within a TabProvider');
  }
  return context;
}
