import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import {quizPoolPlugin} from './scripts/quizPool';
import {modulKopfPlugin} from './scripts/modulKopf';
import {modulVorladenPlugin, modulBasisChunks} from './scripts/modulVorladen';
import {bedarfsLadenPlugin} from './scripts/bedarfsLaden';

export default defineConfig(() => {
  return {
    // quizPoolPlugin: Fragenpool quiz.json je Modul bzw. in Teilpaketen nachladen (docs/architektur.md)
    // modulKopfPlugin: Lernziele/Kurzfassung/Erkundung/Grenzen je Modul (AP 5.5)
    // modulVorladenPlugin: Modul-Chunks anhand des URL-Hashes früh vorladen (AP 5.5, scripts/vorladen-boot.js)
    // bedarfsLadenPlugin: KaTeX und Chart.js erst bei Bedarf laden (AP 5.5, src/lib/*Bedarf.ts[x])
    plugins: [bedarfsLadenPlugin(), react(), tailwindcss(), quizPoolPlugin(), modulKopfPlugin(), modulVorladenPlugin()],
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
