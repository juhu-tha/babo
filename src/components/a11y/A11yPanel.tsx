import { formatDeWert } from '@/src/utils/numberFormat';
import React from 'react';
import { Type, Sparkles, RotateCcw, Maximize2, ShieldCheck, Contrast, Keyboard, Columns, LayoutGrid } from 'lucide-react';
import type { A11ySettings, Bildschirmbreite } from './AccessibilityToolbar';

/**
 * Einstellungsdialog der Barrierefreiheit. Wird erst beim Öffnen nachgeladen (Einstiegsbudget, AP 6.4);
 * Speichern und Anwenden der Einstellungen bleiben in AccessibilityToolbar.tsx.
 */
export interface A11yPanelProps {
  settings: A11ySettings;
  updateSetting: <K extends keyof A11ySettings>(key: K, value: A11ySettings[K]) => void;
  screenWidth: Bildschirmbreite;
  changeScreenWidth: (mode: Bildschirmbreite) => void;
  resetSettings: () => void;
}

export default function A11yPanel({ settings, updateSetting, screenWidth, changeScreenWidth, resetSettings }: A11yPanelProps) {
  return (
    <div 
      role="dialog"
      aria-label="Barrierefreiheits-Einstellungen"
      className="absolute right-0 mt-2 w-84 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150 text-text-main dark:text-slate-100 text-xs"
    >
      <div className="flex items-center justify-between border-b border-slate-150 dark:border-slate-800 pb-2.5 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1 bg-shiraz/10 text-shiraz rounded-md">
            <ShieldCheck size={16} />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-xs">Barrierefreiheit (A11y)</h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">A11y = Accessibility • BITV 2.0 / WCAG 2.1</p>
          </div>
        </div>
        <button
          onClick={resetSettings}
          className="text-[11px] text-slate-400 hover:text-shiraz flex items-center gap-1 transition-colors cursor-pointer"
          title="Auf Standardeinstellungen zurücksetzen"
        >
          <RotateCcw size={11} /> Reset
        </button>
      </div>

      <div className="space-y-3.5">
        {/* 1. Schriftgrößen-Skalierung per Schieberegler */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
              <Type size={13} className="text-shiraz" /> Schriftgröße
            </span>
            <span className="font-mono text-[11px] font-bold text-shiraz dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded border border-rose-200 dark:border-rose-900">
              {formatDeWert(Math.round(settings.fontSizeScale * 100))}% {settings.fontSizeScale < 0.98 ? '(Verkleinert)' : settings.fontSizeScale > 1.02 ? '(Vergrößert)' : '(Standard)'}
            </span>
          </div>

          {/* Schieberegler (Slider) */}
          <div className="space-y-1 bg-slate-50 dark:bg-slate-850 p-2.5 rounded-xl border border-slate-200 dark:border-slate-750">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">A-</span>
              <input
                type="range"
                min="75"
                max="135"
                step="5"
                value={Math.round(settings.fontSizeScale * 100)}
                onChange={(e) => updateSetting('fontSizeScale', Number(e.target.value) / 100)}
                className="w-full accent-shiraz cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg"
                aria-label="Schriftgröße per Schieberegler einstellen"
              />
              <span className="text-[12px] font-bold text-slate-700 dark:text-slate-200">A+</span>
            </div>
            <div className="flex justify-between text-[9px] text-slate-400 dark:text-slate-500 px-0.5 font-mono">
              <span>75% (Min)</span>
              <span>100%</span>
              <span>135% (Max)</span>
            </div>
          </div>

          {/* Quick-Preset-Buttons inklusive Verkleinerung */}
          <div className="grid grid-cols-5 gap-1">
            <button
              type="button"
              onClick={() => updateSetting('fontSizeScale', 0.75)}
              className={`py-1 rounded-lg border text-[10px] font-bold transition-all cursor-pointer ${
                Math.abs(settings.fontSizeScale - 0.75) < 0.03
                  ? 'bg-shiraz text-white border-shiraz'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
              }`}
              title="Schriftgröße stark verkleinern (75%)"
            >
              75%
            </button>
            <button
              type="button"
              onClick={() => updateSetting('fontSizeScale', 0.85)}
              className={`py-1 rounded-lg border text-[10px] font-bold transition-all cursor-pointer ${
                Math.abs(settings.fontSizeScale - 0.85) < 0.03
                  ? 'bg-shiraz text-white border-shiraz'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
              }`}
              title="Schriftgröße verkleinern (85%)"
            >
              85%
            </button>
            <button
              type="button"
              onClick={() => updateSetting('fontSizeScale', 1.0)}
              className={`py-1 rounded-lg border text-[10px] font-bold transition-all cursor-pointer ${
                Math.abs(settings.fontSizeScale - 1.0) < 0.03
                  ? 'bg-shiraz text-white border-shiraz'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
              }`}
              title="Standard-Schriftgröße (100%)"
            >
              100%
            </button>
            <button
              type="button"
              onClick={() => updateSetting('fontSizeScale', 1.15)}
              className={`py-1 rounded-lg border text-[10px] font-bold transition-all cursor-pointer ${
                Math.abs(settings.fontSizeScale - 1.15) < 0.03
                  ? 'bg-shiraz text-white border-shiraz'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
              }`}
              title="Schriftgröße vergrößern (115%)"
            >
              115%
            </button>
            <button
              type="button"
              onClick={() => updateSetting('fontSizeScale', 1.30)}
              className={`py-1 rounded-lg border text-[10px] font-bold transition-all cursor-pointer ${
                Math.abs(settings.fontSizeScale - 1.30) < 0.03
                  ? 'bg-shiraz text-white border-shiraz'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
              }`}
              title="Schriftgröße stark vergrößern (130%)"
            >
              130%
            </button>
          </div>
        </div>

        {/* 2. Bildschirmbreite / Layout */}
        <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-slate-800">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
              <Columns size={13} className="text-shiraz" /> Bildschirmbreite
            </span>
            <span className="font-mono text-[11px] font-bold text-shiraz dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded border border-rose-200 dark:border-rose-900">
              {screenWidth === 'standard' ? '1152 px (Standard)' : screenWidth === 'wide' ? '1536 px (Breit)' : '100% (Vollbild)'}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1">
            <button
              type="button"
              onClick={() => changeScreenWidth('standard')}
              className={`py-1.5 px-2 rounded-lg border text-[10px] font-bold transition-all cursor-pointer flex flex-col items-center gap-0.5 ${
                screenWidth === 'standard'
                  ? 'bg-shiraz text-white border-shiraz shadow-xs'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
              }`}
              title="Standardbreite 1152px (optimale Lesbarkeit)"
            >
              <span className="flex items-center gap-1"><Columns size={11} /> Standard</span>
              <span className="text-[9px] font-normal opacity-80">1152 px</span>
            </button>
            <button
              type="button"
              onClick={() => changeScreenWidth('wide')}
              className={`py-1.5 px-2 rounded-lg border text-[10px] font-bold transition-all cursor-pointer flex flex-col items-center gap-0.5 ${
                screenWidth === 'wide'
                  ? 'bg-shiraz text-white border-shiraz shadow-xs'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
              }`}
              title="Erweitertes Breitbild-Layout 1536px (für Widescreen & Tabellen)"
            >
              <span className="flex items-center gap-1"><LayoutGrid size={11} /> Breit</span>
              <span className="text-[9px] font-normal opacity-80">1536 px</span>
            </button>
            <button
              type="button"
              onClick={() => changeScreenWidth('full')}
              className={`py-1.5 px-2 rounded-lg border text-[10px] font-bold transition-all cursor-pointer flex flex-col items-center gap-0.5 ${
                screenWidth === 'full'
                  ? 'bg-shiraz text-white border-shiraz shadow-xs'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
              }`}
              title="100% Volle Bildschirmbreite (Fluid-Modus)"
            >
              <span className="flex items-center gap-1"><Maximize2 size={11} /> Vollbild</span>
              <span className="text-[9px] font-normal opacity-80">100%</span>
            </button>
          </div>
        </div>

        {/* 3. Starker Kontrast */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
          <div>
            <span className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
              <Contrast size={13} className="text-shiraz" /> Hoher Kontrast (AAA)
            </span>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Verstärkt Ränder, Schriften und Formelelemente</p>
          </div>
          <button
            role="switch"
            aria-checked={settings.highContrast} aria-label="Hoher Kontrast"
            onClick={() => updateSetting('highContrast', !settings.highContrast)}
            className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
              settings.highContrast ? 'bg-shiraz' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <div
              className={`w-3.5 h-3.5 bg-white rounded-full transition-transform absolute top-0.5 left-0.5 ${
                settings.highContrast ? 'translate-x-5' : ''
              }`}
            />
          </button>
        </div>

        {/* 3. Legasthenie-Schrift / Dyslexic readability */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
          <div>
            <span className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
              <Sparkles size={13} className="text-shiraz" /> Lesefreundliche Serifenlos
            </span>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Vergrößerter Buchstabenabstand &amp; Zeilenhöhe</p>
          </div>
          <button
            role="switch"
            aria-checked={settings.dyslexicFont} aria-label="Lesefreundliche Schrift"
            onClick={() => updateSetting('dyslexicFont', !settings.dyslexicFont)}
            className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
              settings.dyslexicFont ? 'bg-shiraz' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <div
              className={`w-3.5 h-3.5 bg-white rounded-full transition-transform absolute top-0.5 left-0.5 ${
                settings.dyslexicFont ? 'translate-x-5' : ''
              }`}
            />
          </button>
        </div>

        {/* 4. Verstärkter Tastatur-Fokus */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
          <div>
            <span className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
              <Keyboard size={13} className="text-shiraz" /> Tastatur-Fokusring
            </span>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Prägnanter Indikator beim Tab-Navigieren</p>
          </div>
          <button
            role="switch"
            aria-checked={settings.focusHighlight} aria-label="Tastatur-Fokusring"
            onClick={() => updateSetting('focusHighlight', !settings.focusHighlight)}
            className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
              settings.focusHighlight ? 'bg-shiraz' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <div
              className={`w-3.5 h-3.5 bg-white rounded-full transition-transform absolute top-0.5 left-0.5 ${
                settings.focusHighlight ? 'translate-x-5' : ''
              }`}
            />
          </button>
        </div>
      </div>

      <div className="mt-3 pt-2.5 border-t border-slate-150 dark:border-slate-800 text-[10px] text-slate-400 dark:text-slate-500 text-center">
        Präferenzen werden lokal im Browser gespeichert.
      </div>
    </div>
  );
}
