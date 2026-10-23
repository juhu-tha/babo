import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { TAB_ALIASES, MODUL_BY_ID, type ModulId, type AliasId } from '@/src/registry/modules';

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
  return clean in TAB_ALIASES || (MODUL_BY_ID.has(clean) && !clean.startsWith('divider_'));
}

function getInitialTab(): TabId {
  // Direktlinks (z. B. baustoffboard.de/#spannbeton) beim ersten Laden berücksichtigen
  try {
    if (typeof window !== 'undefined') {
      const hash = decodeURIComponent(window.location.hash.substring(1)).trim();
      if (hash && isKnownTab(hash)) return resolveTabId(hash.toLowerCase());
    }
  } catch {
    /* ungültiger Hash → Startseite */
  }
  return 'start';
}

export function TabProvider({ children }: { children: ReactNode }) {
  // P23: Initial state from location.hash if known, else 'start'
  const [activeTabState, setActiveTabState] = useState<TabId>(getInitialTab);

  const setActiveTab = (tab: TabId) => {
    const resolved = resolveTabId(tab);
    setActiveTabState(resolved);
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

  // Sync activeTab to URL hash for SEO & bookmarking
  useEffect(() => {
    try {
      const currentHash = window.location.hash.substring(1);
      if (currentHash !== activeTab) {
        window.location.hash = activeTab;
      }
    } catch (e) {}
  }, [activeTab]);

  // Handle browser back/forward buttons navigating tabs
  useEffect(() => {
    const handleHashChange = () => {
      try {
        const hash = window.location.hash.substring(1);
        if (hash) {
          setActiveTab(hash as TabId);
        }
      } catch (e) {}
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
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
