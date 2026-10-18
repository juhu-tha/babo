import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { GROUP_EN, CLUSTER_EN, TAB_EN, UI_EN, UI_DE } from '../i18n/translations';

export type Language = 'de' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: keyof typeof UI_EN, fallback?: string) => string;
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

  const t = (key: keyof typeof UI_EN, fallback?: string): string => {
    if (language === 'en' && UI_EN[key]) {
      return UI_EN[key];
    }
    if (language === 'de' && UI_DE[key]) {
      return UI_DE[key];
    }
    return fallback || UI_DE[key] || UI_EN[key] || String(key);
  };

  const getTabLabel = (tabId: string, defaultLabel: string): string => {
    if (language === 'en' && TAB_EN[tabId]) {
      return TAB_EN[tabId];
    }
    return defaultLabel;
  };

  const getGroupName = (groupName: string): string => {
    if (language === 'en' && GROUP_EN[groupName]) {
      return GROUP_EN[groupName];
    }
    return groupName;
  };

  const getClusterName = (clusterId: string, defaultName: string): string => {
    if (language === 'en' && CLUSTER_EN[clusterId]) {
      return CLUSTER_EN[clusterId];
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
      if (!(window as any).google || !(window as any).google.translate) {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        script.async = true;
        (window as any).googleTranslateElementInit = () => {
          new (window as any).google.translate.TranslateElement(
            { pageLanguage: 'de', includedLanguages: 'en,de', autoDisplay: false },
            'google_translate_element'
          );
        };
        document.body.appendChild(script);
      } else {
        try {
          new (window as any).google.translate.TranslateElement(
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
  t: (key, fallback) => fallback || (UI_DE as any)[key] || String(key),
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
