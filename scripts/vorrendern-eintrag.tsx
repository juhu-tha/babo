/**
 * Einstieg für das Vorrendern im Build (Z52): wird von scripts/vorrendern.ts per Vite-SSR-Build gebündelt
 * (gleiche Plugins wie der Client-Build: Inhalte, Kopfdaten, Registry-Auszug) und dann in Node ausgeführt.
 * Rendert die App für eine Modul-ID mit react-dom/server; Lazy-Komponenten werden abgewartet (onAllReady).
 */
import { Writable } from 'stream';
import { renderToPipeableStream } from 'react-dom/server';
import App, { vorbereiten } from '../src/App';
import { LanguageProvider } from '../src/contexts/LanguageContext';
import type { TabId } from '../src/contexts/TabContext';
import { MODULE, TAB_ALIASES, type ModulEintrag } from '../src/registry/modules';

export interface Route { id: string; label: string; titel?: string; meta?: string }

/** vorzurendernde Module: alle Registry-Einträge außer Startseite, Admin und Menütrennern */
export function routen(): Route[] {
  const alle: readonly ModulEintrag[] = MODULE;
  return alle
    .filter(m => m.id !== 'start' && m.id !== 'admin' && !m.id.startsWith('divider_'))
    .map(m => ({ id: m.id, label: m.label, titel: m.baum?.titel, meta: m.meta }));
}

export const aliase: Readonly<Record<string, string>> = TAB_ALIASES;

/** alle gültigen Modul-IDs (auch nicht vorgerenderte wie admin) – Server: 200 statt 404 */
export const bekannt: readonly string[] = (MODULE as readonly ModulEintrag[]).map(m => m.id).filter(id => !id.startsWith('divider_'));

/** App-HTML (Inhalt von #root) für ein Modul; Fehler einzelner Komponenten landen in `fehler` */
export async function rendere(id: string, zeitLimitMs = 20_000): Promise<{ html: string; fehler: string[] }> {
  // Chunks und Kopfdaten vorab laden wie im Browser (src/main.tsx): dann rendert alles ohne Suspendieren
  await vorbereiten(id as TabId);
  return new Promise((ok, nein) => {
    const fehler: string[] = [];
    let html = '';
    const ziel = new Writable({ write(teil, _k, weiter) { html += String(teil); weiter(); } });
    ziel.on('finish', () => { clearTimeout(uhr); ok({ html, fehler }); });
    const strom = renderToPipeableStream(
      <LanguageProvider><App startTab={id as TabId} vorgerendert vorrendern /></LanguageProvider>,
      {
        // alles inline (sonst lagert React große Grenzen als nachgereichte Segmente mit Skript aus)
        progressiveChunkSize: Number.POSITIVE_INFINITY,
        onAllReady() { strom.pipe(ziel); },
        onShellError(f) { clearTimeout(uhr); nein(f); },
        onError(f) { fehler.push(f instanceof Error ? f.message : String(f)); },
      },
    );
    const uhr = setTimeout(() => strom.abort(new Error(`Zeitlimit ${zeitLimitMs} ms`)), zeitLimitMs);
  });
}
