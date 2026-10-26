import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App';
import { LanguageProvider } from './contexts/LanguageContext';
import { isKnownTab, resolveTabId } from './contexts/TabContext';
import './index.css';
import { ladeSchriften } from './lib/schriften';
// KaTeX-CSS bleibt im Haupt-CSS (7,7 kB gzip): Ein nachträglich eingefügtes Stylesheet erzwingt eine Neuberechnung
// von Stil und Layout der ganzen Seite (lange Task). KaTeX-JS und -Schriften werden erst bei Bedarf geladen (AP 5.5).
import 'katex/dist/katex.min.css';

// Direktaufruf einer Modulseite (#modul-id): Inhaltsverteiler, Modulkopf und Kopfdaten anfordern, bevor
// React rendert (Phase 5, AP 5.5). Im Build setzt das Inline-Skript aus scripts/vorladen-boot.js schon parallel
// zum Einstiegs-Chunk modulepreload-Links für diese Chunks und den Modul-Chunk; hier zusätzlich für Aliase und
// den Dev-Server.
try {
  const hash = decodeURIComponent(window.location.hash.slice(1)).trim().toLowerCase();
  if (hash && hash !== 'start' && isKnownTab(hash)) {
    void import('./routing/ModulInhalt');
    void import('./routing/modulKopfDaten').then(m => m.ladeKopfDaten(resolveTabId(hash)));
    void import('./routing/ModulKopf');
  }
} catch { /* nur Beschleunigung */ }

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </StrictMode>,
);

// Schrift Inter nach dem ersten Bild nachladen (Text statt Binärdatei, siehe src/lib/schriftDaten.ts)
const schriftenSpaeter = () => { void ladeSchriften(); };
if ('requestIdleCallback' in window) window.requestIdleCallback(schriftenSpaeter, { timeout: 2000 });
else setTimeout(schriftenSpaeter, 200);
