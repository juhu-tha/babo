import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App, { vorbereiten } from './App';
import { LanguageProvider } from './contexts/LanguageContext';
import { isKnownTab, resolveTabId, tabAusAdresse, type TabId } from './contexts/TabContext';
import './index.css';
import { ladeSchriften } from './lib/schriften';
// KaTeX-CSS bleibt im Haupt-CSS (7,7 kB gzip): Ein nachträglich eingefügtes Stylesheet erzwingt eine Neuberechnung
// von Stil und Layout der ganzen Seite (lange Task). KaTeX-JS und -Schriften werden erst bei Bedarf geladen (AP 5.5).
import 'katex/dist/katex.min.css';

// Modul der Adresse: /modul/<id> bzw. alter Hash-Link /#<id> (Z52, src/routing/pfad.ts)
let tab: TabId = 'start';
try {
  const t = tabAusAdresse();
  if (t && isKnownTab(t)) tab = resolveTabId(t);
} catch { /* Startseite */ }

// Direktaufruf einer Modulseite: Inhaltsverteiler, Modulkopf und Kopfdaten anfordern, bevor React rendert
// (Phase 5, AP 5.5). Im Build setzt das Inline-Skript aus scripts/vorladen-boot.js schon parallel zum
// Einstiegs-Chunk modulepreload-Links für diese Chunks und den Modul-Chunk; hier zusätzlich für Aliase und
// den Dev-Server.
if (tab !== 'start') {
  try {
    void import('./routing/ModulInhalt');
    void import('./routing/modulKopfDaten').then(m => m.ladeKopfDaten(tab));
    void import('./routing/ModulKopf');
  } catch { /* nur Beschleunigung */ }
}

// Vorgerenderte Modulseite (dist/modul/<id>.html, scripts/vorrendern.ts) sichtbar? Das Inline-Skript
// scripts/startschale-boot.js setzt bb-schale nur, wenn sie zur Adresse und den Einstellungen passt.
const vorgerendert = tab !== 'start'
  && document.documentElement.classList.contains('bb-schale')
  && document.querySelector('meta[name="bb-vorgerendert"]')?.getAttribute('content') === tab;

const starte = () => createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <App vorgerendert={vorgerendert} />
    </LanguageProvider>
  </StrictMode>,
);

if (vorgerendert) {
  // Erst rendern, wenn alle Teile da sind: React ersetzt die statische Seite dann in einem Schritt (ohne Spinner).
  // Bis dahin bleibt die statische Seite stehen (inert); nach spätestens 10 s wird trotzdem gerendert.
  let gestartet = false;
  const einmal = () => { if (!gestartet) { gestartet = true; starte(); } };
  vorbereiten(tab).then(einmal, einmal);
  setTimeout(einmal, 10_000);
} else {
  starte();
}

// Schrift Inter nach dem ersten Bild nachladen (Text statt Binärdatei, siehe src/lib/schriftDaten.ts)
const schriftenSpaeter = () => { void ladeSchriften(); };
if ('requestIdleCallback' in window) window.requestIdleCallback(schriftenSpaeter, { timeout: 2000 });
else setTimeout(schriftenSpaeter, 200);
