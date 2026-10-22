import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { TAB_DESCRIPTIONS } from '@/src/metaDescriptions';

export type TabId =
  | 'admin'
 
  | 'start'
  | 'labor_sicherheit'
  | 'modulstruktur'
  | 'beton_info'
  | 'grundlagen_info'
  | 'labor_info'
  | 'baustoffe_info'
  | 'bauprodukte_info'
  | 'stahlbeton_info'
  | 'mechanik_info'
  | 'bauphysik_info'
  | 'nachhaltigkeit_info'
  | 'nachhaltigkeit_daten_regeln'
  | 'nachhaltigkeit_checklisten'
  | 'digitales_info'
  | 'bestand_info'
  | 'rueckbau_info'
  | 'dauerhaftigkeit_info'
  | 'schaeden_info'
  | 'praxiswissen_info'
  | 'infos_info'
  | 'aufgaben_info'
  | 'beton_a_z'
  | 'analytik'
  | 'bauschaeden'
  | 'dpp_epd'
  | 'dpp'
  | 'digitales_gesamt'
  | 'lebenszyklus_kosten'
  | 'ressourcen_umwelt'
  | 'kreislauf_dpp'
  | 'zertifizierung_siegel'
  | 'oekobilanz_lca'
        | 'divider_digitales'
  | 'labor'
  | 'mechanische_pruefungen'
  | 'biegezugversuch'
  | 'mischungsberechnung'
  | 'betonkennwerte'
  | 'frischbeton'
  | 'frischbetontemperatur' 
    | 'hydratation' 
  | 'nachbehandlung' 
  | 'festbeton' 
  | 'statistik'
  | 'festbeton_statistik'
      | 'korrosion' 
  | 'spannung' 
  | 'materialkennwerte' 
  | 'historisch'
  | 'historische_bauweisen'
  | 'historische_bauprodukte'
  | 'holz' 
  | 'kriechen' 
  | 'rissbreite'
  | 'festigkeit'
  | 'stahlbeton_bemessung'
  | 'biegebemessung'
  | 'querkraftbemessung'
  | 'stuetzenbemessung'
  | 'durchstanzen'
  | 'verankerungslaenge'
  | 'stahl'
  | 'mauerwerk'
  | 'glas'
  | 'bauphysik'
  | 'nachhaltigkeit'
  | 'zertifizierung'
  | 'produktsiegel'
  | 'porositaet'
  | 'asphalt'
  | 'faserverbund'
  | 'lehm'
  | 'bp_lehmbauprodukte'
  | 'brandschutz'
  | 'bruchmechanik'
  | 'ermuedung'
  | 'knicken'
  | 'mechanische_kenngroessen'
  | 'baustatik'
  | 'schadreaktionen_beton'
  | 'zementchemie'
      | 'bodenmechanik'
  | 'wu-bauwerke'
  | 'zfp'
  | 'baubetrieb'
  | 'emodul'
  | 'carbonbeton'
  | 'waermeeigenschaften'
  | 'daemmung_vergleich'
  | 'spannbeton'
  | 'anleitung'
  | 'statistische_versuchsplanung'
  | 'labor'
  | 'statistik'
  | 'aufgaben'
  | 'aufgaben_quiz'
  | 'aufgaben_beton'
  | 'aufgaben_stahl'
  | 'aufgaben_weitere'
  | 'aufgaben_mechanik'
  | 'aufgaben_bauphysik'
  | 'aufgaben_holzbau'
  | 'aufgaben_bauprodukte'
  | 'aufgaben_bestand'
  | 'aufgaben_dauerhaftigkeit'
  | 'aufgaben_rueckbau'
  | 'aufgaben_nachhaltigkeit'
  | 'aufgaben_kennwerte'
  | 'aufgaben_digitales'
  | 'aufgaben_komplex'
  | 'aufgaben_trainer'
  | 'aufgaben_klausur'
  | 'praxisbeispiele'
  | 'kunststoffe'
  | 'zwang'
  | 'eigenspannungen'
  | 'regularien'
  | 'feedback'
  | 'nawaro'
  | 'kreislaufwirtschaft'
  | 'preisentwicklung'
  | 'lebensdauern'
  | 'instandhaltung'
  | 'schallschutz'
  | 'stahlbau'
  | 'glossar'
  | 'materialdatenbanken'
  | 'festigkeitsberechnungen'
  | 'dauerhaftigkeit'
  | 'schadstoffe'
  | 'abfaelle'
  | 'obsoleted_ref'
  | 'vdi6200'
  | 'schadensbilder'
  | 'bauwerksunters_monitoring'
  | 'informationsquellen'
  | 'lokales'
  | 'herstellung_einbau'
    | 'metalle'
  | 'ausbau'
  | 'bauchemie'
  | 'literatur'
  | 'steifigkeit'
  | 'einheiten'
  | 'baustoffkunde'
  | 'baustoffkenngroessen'
  | 'formaenderungen'
  | 'holzwerkstoffe'
  | 'materialmodelle'
  | 'lca'
  | 'ressourcen_emissionen'
  | 'lcc'
  | 'feuchteschutz'
  | 'bauwerksuntersuchung'
  | 'materialpaesse'
  | 'materialitaet_architektur'
  | 'putzemoertel'
  | 'gesteine'
  | 'sonstiges'
  | 'software'
  | 'online_tools'
  | 'erdbau'
  | 'sicherheitskonzept'
  | 'innovative_werkstoffe'
  | 'ki_baustoffe'
  | 'ki_ueberblick'
  | 'ki_system'
  | 'ki_prompting'
  | 'ki_llmpraxis'
  | 'ki_thesen'
  | 'ki_recht_ethik'
  | 'ki_lokal'
  | 'ki_ressourcen'
  | 'ki_onlinekurse'
  | 'rechnung_u_wert'
  | 'rechnung_beton'
  | 'rechnung_stahlbeton'
  | 'rechnung_holzbau'
  | 'rechnung_mauerwerk'
  | 'rechnung_nachhaltigkeit'
  | 'rechnung_bestand'
  | 'rechnung_schallschutz'
  | 'rechnung_brandschutz'
  | 'bim_baustoffe'
  | 'aufgaben_stahlbeton'
  | 'stahlbeton'
  | 'bestand'
  | 'gips'
  | 'kalk'
  | 'bauprodukte'
  | 'daemmstoffe'
  | 'innenausbau'
  | 'bp_trockenbau'
  | 'bp_mauerwerk'
  | 'bp_verkehrswegebau'
  | 'bp_verkehr_rsto'
  | 'bp_verkehr_asphalt'
  | 'bp_verkehr_bitumen'
  | 'bp_verkehr_pruefung'
  | 'bp_verkehr_bahn'
  | 'bp_verkehr_tunnel'
  | 'bp_verkehr_betondecken'
  | 'bp_verkehr_tiefbau'
  | 'bp_abdichtung'
  | 'bp_daemmung'
  | 'bp_putz_estrich'
  | 'bp_holzprodukte'
  | 'bp_dach_fassade'
  | 'bp_befestigung'
  | 'bp_kunststoffe'
  | 'bp_klebstoffe'
  | 'bp_farben_lacke'
  | 'bp_mineralisch'
  | 'bp_glaeser'
  | 'bp_metallisch'
  | 'bp_stahlbauprofile'
  | 'bp_baustoffindustrie'
  | 'bp_betonzusatzmittel'
  | 'bp_innovationen'
  | 'impressum'
  | 'versionen'
  | 'probenahme'
  | 'energieausweis'
  | 'sonderbeton'
  | 'bindemittel'
  | 'bp_beton'
  | 'bp_betonfertigteile'
  | 'bp_betonwaren'
  | 'px_planung'
  | 'px_bauleitung'
  | 'px_bautagebuch'
  | 'px_produktion'
  | 'px_karriere'
  | 'qualitaetssicherung'
  | 'betonpraxis'  | 'expositionsklassen'
  | 'bp_rechtliches'
  | 'bp_recht_grundlagen'
  | 'bp_recht_avcp'
  | 'bp_recht_konformitaet'
  | 'bp_recht_normen'
  | 'wta'
  | 'denkmalpflege'
  | 'holzkorrosion'
  | 'metallkorrosion'
  | 'weitere_organik'
  | 'hydratation_folgen'
  | 'sonderbetone'
  | 'ressourceneffizienz'
  | 'modernisierung'
  | 'grundlagen'
  | 'boden_materialaufbereitung'
  | 'rueckbau'
  | 'rueckbau_checklisten'
  | 'bestand_checklisten'
  | 'dauerhaftigkeit_checklisten'
  | 'schaeden_checklisten'
  | 'material_schaeden_gross'
  | 'messen_pruefen'
  | 'bauwerkserfassung'
  | 'materialoptimierung'
  | 'fortbildungen'
  | 'weiter_tha'
  | 'weiter_bauing'
  | 'weiter_pm'
  | 'weiter_ausbau'
  | 'weiter_fassade'
  | 'weiter_holzbau'
  | 'weiter_ttz'
  | 'weiter_mapr'
  | 'studium_tha'
  | 'holzbau_info'
  | 'holzbau_werkstoffe'
  | 'holzbau_konstruktion'
  | 'holzbau_bemessung'
  | 'holzbau_verbindung'
  | 'holzbau_bauphysik'
  | 'thesen_projekte'
  | 'kuriositaeten'
  | 'instandsetzung_info'
  | 'schutz_grundlagen'
  | 'instandsetzung_materialien'
  | 'instandsetzung_checklisten'
  | 'instandsetzung_holz'
  | 'instandsetzung_metalle'
  | 'instandsetzung_kunststoffe'
  | 'instandsetzung_asphalt'
  | 'instandsetzung_mauerwerk'
  | 'datenschutz'
  | 'sichtbeton'
  | 'vl_ueberblick'
  | 'vl_bauen_im_bestand'
  | 'vl_nachhaltiges_bauen'
  | 'vl_bauschaeden'
  | 'vl_baustoffkunde'
  | 'vl_instandhaltung';

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

// Canonical alias map to ensure 100% link integrity across legacy bookmarks, quizzes, and modules
export const TAB_ALIASES: Record<string, TabId> = {
  'infos_info': 'informationsquellen',
  'aufgaben_info': 'aufgaben_beton',
  'dpp_epd': 'dpp',
  'digitales_gesamt': 'digitales_info',
  'divider_digitales': 'digitales_info',
  'biegezugversuch': 'labor',
  'frischbetontemperatur': 'frischbeton',
  'hydratation': 'hydratation_folgen',
  'nachhaltigkeit': 'nachhaltigkeit_info',
  'daten_regeln': 'nachhaltigkeit_daten_regeln',
  'datenundregeln': 'nachhaltigkeit_daten_regeln',
  'nachhaltigkeit_regeln': 'nachhaltigkeit_daten_regeln',
  'sdg': 'nachhaltigkeit_daten_regeln',
  'taxonomie': 'nachhaltigkeit_daten_regeln',
  'epbd': 'nachhaltigkeit_daten_regeln',
  'stoffstroeme': 'nachhaltigkeit_daten_regeln',
  'zertifizierung': 'zertifizierung_siegel',
  'produktsiegel': 'zertifizierung_siegel',
  'porositaet': 'baustoffkenngroessen',
  'ermuedung': 'mechanische_pruefungen',
  'zementchemie': 'bindemittel',
  'baubetrieb': 'px_bauleitung',
  'statistische_versuchsplanung': 'statistik',
  'praxisbeispiele': 'px_planung',
  'kreislaufwirtschaft': 'kreislauf_dpp',
  'preisentwicklung': 'lebenszyklus_kosten',
  'lebensdauern': 'lebenszyklus_kosten',
  'stahlbau': 'stahl',
  'festigkeitsberechnungen': 'festigkeit',
  'obsoleted_ref': 'literatur',
  'lokales': 'labor',
  'steifigkeit': 'emodul',
  'lca': 'oekobilanz_lca',
  'ressourcen_emissionen': 'ressourcen_umwelt',
  'lcc': 'lebenszyklus_kosten',
  'stahlbeton': 'stahlbeton_bemessung',
  'bauteilbemessung': 'stahlbeton_bemessung',
  'bauprodukte': 'bauprodukte_info',
  'sonderbeton': 'sonderbetone',
  'vorlesungen': 'vl_bauen_im_bestand',
  'vorlesung': 'vl_bauen_im_bestand',
  'vl_ueberblick': 'vl_bauen_im_bestand',
  'vl_bestand': 'vl_bauen_im_bestand',
  'vl_nachhaltigkeit': 'vl_nachhaltiges_bauen',
  'vl_schaeden': 'vl_bauschaeden',
  'vl_baustoffe': 'vl_baustoffkunde',
  'vl_instandsetzung': 'vl_instandhaltung'
};

export function resolveTabId(tab: string): TabId {
  if (tab in TAB_ALIASES) {
    return TAB_ALIASES[tab];
  }
  return tab as TabId;
}

export function isKnownTab(tab: string): boolean {
  if (!tab) return false;
  const clean = tab.trim().toLowerCase();
  return clean in TAB_ALIASES || clean in TAB_DESCRIPTIONS;
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
