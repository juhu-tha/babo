import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import {quizPoolPlugin} from './scripts/quizPool';

export default defineConfig(() => {
  return {
    // quizPoolPlugin: Fragenpool quiz.json je Modul bzw. in Teilpaketen nachladen (docs/architektur.md)
    plugins: [react(), tailwindcss(), quizPoolPlugin()],
    // Hinweis: GEMINI_API_KEY wird bewusst NICHT per `define` in das Frontend geschrieben.
    // Der Schlüssel wird nur im Server (server.ts) verwendet.
    resolve: {
      dedupe: ['react', 'react-dom'],
      alias: {
        '@': path.resolve(process.cwd(), '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
