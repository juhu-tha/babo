import React from 'react';
import { Languages } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export const LanguageSwitcher: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { language, setLanguage, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all border font-medium cursor-pointer shadow-2xs select-none ${
        language === 'en'
          ? 'bg-shiraz text-white border-shiraz hover:bg-shiraz/90 shadow-sm'
          : 'bg-off-white dark:bg-slate-800 hover:bg-home-grau/20 dark:hover:bg-slate-700 text-text-main dark:text-white border-home-grau/20 dark:border-slate-700'
      }`}
      title={language === 'de' ? "Switch to English (Englisch aktivieren)" : "Auf Deutsch zurückwechseln"}
      aria-label="Language Switcher"
    >
      <Languages size={15} className={language === 'en' ? "text-white" : "text-shiraz"} />
      <span className="text-xs font-bold font-mono tracking-wide">
        {language === 'de' ? 'DE' : 'EN'}
      </span>
      {!compact && (
        <span className="text-[10px] opacity-80 hidden lg:inline font-sans">
          {language === 'de' ? '🇩🇪' : '🇬🇧'}
        </span>
      )}
    </button>
  );
};
