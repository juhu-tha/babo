import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UI_DE } from '../i18n/uiDe';
import type * as EnTexte from '../i18n/translations';

// Englische Texte erst bei Bedarf laden (Bundle-Budget Einstieg, AP 6.1); bis dahin deutsche Beschriftungen.
type EnPaket = typeof EnTexte;
let enGeladen: EnPaket | undefined;
const ladeEn = (): Promise<EnPaket> => import('../i18n/translations').then(m => (enGeladen = m));

export type Language = 'de' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: keyof typeof EnTexte.UI_EN, fallback?: string) => string;
  getTabLabel: (tabId: string, defaultLabel: string) => string;
  getGroupName: (groupName: string) => string;
  getClusterName: (clusterId: string, defaultName: string) => string;
  isDeepTranslating: boolean;
  toggleDeepTranslate: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('baustoffboard_lang') as Language;
      if (saved === 'de' || saved === 'en') return saved;
      // Default to German
      return 'de';
    }
    return 'de';
  });

  const [isDeepTranslating, setIsDeepTranslating] = useState<boolean>(false);
  const [en, setEn] = useState<EnPaket | undefined>(enGeladen);

  useEffect(() => {
    if (language !== 'en' || en) return;
    let aktiv = true;
    ladeEn().then(m => { if (aktiv) setEn(m); }, e => console.error('Englische Texte konnten nicht geladen werden', e));
    return () => { aktiv = false; };
  }, [language, en]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('baustoffboard_lang', lang);
      document.documentElement.lang = lang;
    }
  };

  const toggleLanguage = () => {
    const nextLang = language === 'de' ? 'en' : 'de';
    setLanguage(nextLang);
  };

  const t = (key: keyof typeof EnTexte.UI_EN, fallback?: string): string => {
    if (language === 'en' && en?.UI_EN[key]) {
      return en.UI_EN[key];
    }
    if (language === 'de' && UI_DE[key]) {
      return UI_DE[key];
    }
    return fallback || UI_DE[key] || en?.UI_EN[key] || String(key);
  };

  const getTabLabel = (tabId: string, defaultLabel: string): string => {
    if (language === 'en' && en?.TAB_EN[tabId]) {
      return en.TAB_EN[tabId];
    }
    return defaultLabel;
  };

  const getGroupName = (groupName: string): string => {
    if (language === 'en' && en?.GROUP_EN[groupName]) {
      return en.GROUP_EN[groupName];
    }
    return groupName;
  };

  const getClusterName = (clusterId: string, defaultName: string): string => {
    if (language === 'en' && en?.CLUSTER_EN[clusterId]) {
      return en.CLUSTER_EN[clusterId];
    }
    return defaultName;
  };

  // Google Translate widget activation for deep module translation
  const toggleDeepTranslate = () => {
    if (typeof window === 'undefined') return;

    if (!isDeepTranslating) {
      // Activate translation
      setIsDeepTranslating(true);
      document.cookie = 'googtrans=/de/en; path=/';
      document.cookie = `googtrans=/de/en; domain=${window.location.hostname}; path=/`;

      // Check if google translate script is loaded
      if (!window.google || !window.google.translate) {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        script.async = true;
        window.googleTranslateElementInit = () => {
          new window.google!.translate!.TranslateElement(
            { pageLanguage: 'de', includedLanguages: 'en,de', autoDisplay: false },
            'google_translate_element'
          );
        };
        document.body.appendChild(script);
      } else {
        try {
          new window.google!.translate!.TranslateElement(
            { pageLanguage: 'de', includedLanguages: 'en,de', autoDisplay: false },
            'google_translate_element'
          );
        } catch {
          // ignore
        }
      }
    } else {
      // Deactivate translation
      setIsDeepTranslating(false);
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=${window.location.hostname}; path=/;`;
      window.location.reload();
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.lang = language;
    }
  }, [language]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
        getTabLabel,
        getGroupName,
        getClusterName,
        isDeepTranslating,
        toggleDeepTranslate
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

const defaultContext: LanguageContextType = {
  language: 'de',
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: (key, fallback) => fallback || UI_DE[key] || String(key),
  getTabLabel: (_id, defaultLabel) => defaultLabel,
  getGroupName: (name) => name,
  getClusterName: (_id, defaultName) => defaultName,
  isDeepTranslating: false,
  toggleDeepTranslate: () => {}
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    return defaultContext;
  }
  return context;
};
