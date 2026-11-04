import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import {quizPoolPlugin} from './scripts/quizPool';
import {modulKopfPlugin} from './scripts/modulKopf';
import {modulVorladenPlugin, modulBasisChunks} from './scripts/modulVorladen';
import {bedarfsLadenPlugin} from './scripts/bedarfsLaden';
import {inhaltEinbettenPlugin} from './scripts/inhaltEinbetten';
import {registryKernPlugin} from './scripts/registryKern';
import {startSchalePlugin} from './scripts/startSchale';
import {kritischesCssPlugin} from './scripts/kritischesCss';
import {vorrendernPlugin} from './scripts/vorrendernPlugin';
import {auditDatenPlugin} from './scripts/auditDaten';
import {sitemapStandPlugin} from './scripts/sitemapStand';
import {tagIso} from './src/data/stand';

export default defineConfig(() => {
  // Stand = Build-Datum (src/data/stand.ts); über die Umgebung an Vorrendern (Kindprozess) und Schale weitergereicht
  if (!/^\d{4}-\d{2}-\d{2}$/.test(process.env.BB_STAND ?? '')) process.env.BB_STAND = tagIso();
  const stand = process.env.BB_STAND as string;
  // Statik-Modus (Vercel ohne Server, src/data/betriebsart.ts): BB_STATISCH=1 aus vercel.json; über die Umgebung
  // auch im Vorrendern (Kindprozess) wirksam, damit vorgerendertes HTML und App übereinstimmen
  const statisch = process.env.BB_STATISCH === '1';
  return {
    define: { __BB_STAND__: JSON.stringify(stand), __BB_STATISCH__: JSON.stringify(statisch) },
    // quizPoolPlugin: Fragenpool quiz.json je Modul bzw. in Teilpaketen nachladen (docs/architektur.md)
    // modulKopfPlugin: Lernziele/Kurzfassung/Erkundung/Grenzen je Modul (AP 5.5)
    // modulVorladenPlugin: Modul-Chunks anhand des URL-Hashes früh vorladen (AP 5.5, scripts/vorladen-boot.js)
    // bedarfsLadenPlugin: KaTeX und Chart.js erst bei Bedarf laden (AP 5.5, src/lib/*Bedarf.ts[x])
    // startSchalePlugin: statische Schale der Startseite in #root (AP 5.5 Nachtrag, scripts/startschale.html)
    // registryKernPlugin: schlanker Registry-Auszug im Einstieg, volle Registry bei Bedarf (AP 5.5 Nachtrag)
    // inhaltEinbettenPlugin: Werte aus content/**.json an den Verweisstellen einsetzen (AP 5.3)
    // auditDatenPlugin: Kennzahlen des Admin-Bereichs „Audit“ aus dem Quelltext (virtual:audit-daten, dist/audit-bundle.json)
    // sitemapStandPlugin: dist/sitemap.xml mit <lastmod> = Build-Datum (public/sitemap.xml ohne lastmod)
    // vorrendernPlugin: nach dem Build je Modul dist/modul/<id>.html vorrendern (Z52, scripts/vorrendern.ts)
    plugins: [inhaltEinbettenPlugin(), bedarfsLadenPlugin(), registryKernPlugin(), react(), tailwindcss(), quizPoolPlugin(), modulKopfPlugin(), modulVorladenPlugin(), startSchalePlugin(), kritischesCssPlugin(), auditDatenPlugin(), sitemapStandPlugin(() => stand), vorrendernPlugin()],
    // Hinweis: GEMINI_API_KEY wird bewusst NICHT per `define` in das Frontend geschrieben.
    // Der Schlüssel wird nur im Server (server.ts) verwendet.
    resolve: {
      dedupe: ['react', 'react-dom'],
      alias: {
        '@': path.resolve(process.cwd(), '.'),
      },
    },
    build: {
      // gemeinsame Bausteine der Fachmodulseiten in einem Chunk statt vieler Kleinst-Chunks (AP 5.5)
      rollupOptions: { output: { manualChunks: modulBasisChunks() } },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
