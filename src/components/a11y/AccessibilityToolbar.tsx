import React, { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';

const A11yPanel = React.lazy(() => import('./A11yPanel'));

export type Bildschirmbreite = 'standard' | 'wide' | 'full';

export interface A11ySettings {
  fontSizeScale: number; // 0.75 (compact/75%), 0.85, 1.0 (default), 1.15, 1.30
  highContrast: boolean;
  dyslexicFont: boolean;
  reducedMotion: boolean;
  focusHighlight: boolean;
}

const STORAGE_KEY = 'th_bauboard_a11y_prefs';

export function getA11yPreferences(): A11ySettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error reading a11y preferences', e);
  }
  return {
    fontSizeScale: 1.0,
    highContrast: false,
    dyslexicFont: false,
    reducedMotion: false,
    focusHighlight: false
  };
}

export function saveA11yPreferences(settings: A11ySettings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    applyA11yToDocument(settings);
  } catch (e) {
    console.error('Error saving a11y preferences', e);
  }
}

export function applyA11yToDocument(settings: A11ySettings) {
  const root = document.documentElement;

  // Font Scaling: Dynamische Skalierung inkl. Verkleinerung (75% bis 135%)
  const scale = settings.fontSizeScale || 1.0;
  root.style.fontSize = `${Math.round(scale * 100)}%`;

  // High Contrast Mode
  if (settings.highContrast) {
    root.classList.add('a11y-high-contrast');
  } else {
    root.classList.remove('a11y-high-contrast');
  }

  // Dyslexic friendly font
  if (settings.dyslexicFont) {
    root.classList.add('a11y-dyslexic-font');
  } else {
    root.classList.remove('a11y-dyslexic-font');
  }

  // Reduced motion
  if (settings.reducedMotion) {
    root.classList.add('a11y-reduced-motion');
  } else {
    root.classList.remove('a11y-reduced-motion');
  }

  // Large Focus Indicators
  if (settings.focusHighlight) {
    root.classList.add('a11y-focus-ring');
  } else {
    root.classList.remove('a11y-focus-ring');
  }
}

// Sofortige Initialisierung beim Laden des Moduls
if (typeof document !== 'undefined') {
  try {
    applyA11yToDocument(getA11yPreferences());
  } catch {}
}

export function AccessibilityToolbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<A11ySettings>(getA11yPreferences);
  const [screenWidth, setScreenWidth] = useState<'standard' | 'wide' | 'full'>(() => {
    try {
      const saved = localStorage.getItem('baustoffboard_screen_width');
      if (saved === 'standard' || saved === 'wide' || saved === 'full') return saved;
      const legacyFluid = localStorage.getItem('baustoffboard_fluid_width');
      if (legacyFluid !== null) return legacyFluid === 'true' ? 'full' : 'standard';
      return 'wide';
    } catch {
      return 'wide';
    }
  });

  useEffect(() => {
    const handleWidthChange = (e: Event) => {
      const custom = e as CustomEvent<'standard' | 'wide' | 'full'>;
      if (custom.detail && (custom.detail === 'standard' || custom.detail === 'wide' || custom.detail === 'full')) {
        setScreenWidth(custom.detail);
      }
    };
    window.addEventListener('baustoffboard_width_change', handleWidthChange);
    return () => window.removeEventListener('baustoffboard_width_change', handleWidthChange);
  }, []);

  const changeScreenWidth = (mode: 'standard' | 'wide' | 'full') => {
    setScreenWidth(mode);
    try {
      localStorage.setItem('baustoffboard_screen_width', mode);
      localStorage.setItem('baustoffboard_fluid_width', mode === 'full' ? 'true' : 'false');
      window.dispatchEvent(new CustomEvent('baustoffboard_width_change', { detail: mode }));
    } catch {}
  };

  useEffect(() => {
    applyA11yToDocument(settings);
  }, [settings]);

  const updateSetting = <K extends keyof A11ySettings>(key: K, value: A11ySettings[K]) => {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    saveA11yPreferences(updated);
  };

  const resetSettings = () => {
    const defaultSettings: A11ySettings = {
      fontSizeScale: 1.0,
      highContrast: false,
      dyslexicFont: false,
      reducedMotion: false,
      focusHighlight: false
    };
    setSettings(defaultSettings);
    saveA11yPreferences(defaultSettings);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        id="a11y-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-label="A11y – Barrierefreiheit und Anzeige-Optionen"
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors border shadow-2xs ${
          settings.highContrast || settings.fontSizeScale !== 1.0 || settings.dyslexicFont || settings.focusHighlight
            ? 'bg-shiraz text-white border-shiraz'
            : 'bg-off-white dark:bg-slate-800 hover:bg-home-grau/20 dark:hover:bg-slate-700 text-text-main dark:text-white border-home-grau/20 dark:border-slate-700'
        }`}
        title="A11y (Accessibility = Barrierefreiheit: Schriftgröße, Schieberegler, Kontrast)"
      >
        <Eye size={14} />
        <span className="hidden sm:inline">A11y</span>
      </button>

      {isOpen && (
        <React.Suspense fallback={null}>
          <A11yPanel settings={settings} updateSetting={updateSetting} screenWidth={screenWidth} changeScreenWidth={changeScreenWidth} resetSettings={resetSettings} />
        </React.Suspense>
      )}
    </div>
  );
}
