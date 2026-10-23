import React, { useState } from 'react';
import { Globe, X, Sparkles, Check } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export const LanguageBanner: React.FC = () => {
  const { language, isDeepTranslating, toggleDeepTranslate, toggleLanguage } = useLanguage();
  const [dismissed, setDismissed] = useState(false);

  if (language !== 'en' || dismissed) {
    return null;
  }

  return (
    <div className="mb-4 p-3 rounded-xl bg-shiraz/5 dark:bg-slate-900 border border-shiraz/20 dark:border-slate-700 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs animate-in fade-in duration-300">
      <div className="flex items-center gap-2.5 text-text-main dark:text-slate-200">
        <div className="w-7 h-7 rounded-lg bg-shiraz/15 text-shiraz dark:text-rose-400 flex items-center justify-center shrink-0">
          <Globe size={15} />
        </div>
        <div>
          <span className="font-bold text-shiraz dark:text-rose-400">English Mode Active:</span>{' '}
          <span className="text-text-main/80 dark:text-slate-300">
            Navigation, module titles, clusters, and tools are in English.
          </span>
          {!isDeepTranslating && (
            <span className="block text-[11px] text-text-main/65 dark:text-slate-400 mt-0.5">
              "Translate Deep Texts" loads Google Translate: your IP address and the page text are sent to Google (USA). See privacy policy (Datenschutz).
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
        <button
          onClick={toggleDeepTranslate}
          className={`px-2.5 py-1 rounded-lg font-bold text-[11px] flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs ${
            isDeepTranslating
              ? 'bg-shiraz text-white hover:bg-shiraz/90'
              : 'bg-white dark:bg-slate-800 text-text-main dark:text-slate-200 border border-home-grau/30 dark:border-slate-700 hover:bg-off-white dark:hover:bg-slate-700'
          }`}
          title="Translate all German body texts into English via Google Translate (data is sent to Google)"
        >
          {isDeepTranslating ? (
            <>
              <Check size={12} />
              <span>Full Text Translated</span>
            </>
          ) : (
            <>
              <Sparkles size={12} className="text-shiraz" />
              <span>Translate Deep Texts</span>
            </>
          )}
        </button>

        <button
          onClick={toggleLanguage}
          className="px-2 py-1 rounded-lg text-[11px] text-slate-500 hover:text-text-main dark:hover:text-white transition-colors cursor-pointer"
          title="Switch back to German"
        >
          🇩🇪 Zurück zu Deutsch
        </button>

        <button
          onClick={() => setDismissed(true)}
          className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
          title="Dismiss notice"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
};
