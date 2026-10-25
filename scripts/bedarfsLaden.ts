/**
 * Vite-Plugin „bedarfs-laden“ (Umsetzungsplan Phase 5, AP 5.5): lenkt Importe großer Bibliotheken aus src/
 * auf schlanke Ersatzmodule um, die die Bibliothek erst bei Bedarf nachladen:
 *   react-katex     → src/lib/katexBedarf.tsx   (KaTeX; das CSS bleibt im Haupt-CSS)
 *   react-chartjs-2 → src/lib/chartBedarf.tsx   (Chart.js-Komponenten, Zeichnen nach Sichtbarkeit)
 *   chart.js        → src/lib/chartJsBedarf.ts  (ChartJS.register(...) mit Bausteinmarken)
 * Ausgenommen sind die Ersatzmodule selbst (sie laden die echten Pakete) und alles außerhalb von src/
 * (z. B. react-chartjs-2 → chart.js in node_modules). Typen und Tests (tsx) bleiben unberührt.
 */
import path from 'path';
import type { Plugin } from 'vite';

export function bedarfsLadenPlugin(wurzel = process.cwd()): Plugin {
  const src = path.resolve(wurzel, 'src') + path.sep;
  const ersatz: Record<string, string> = {
    'react-katex': path.resolve(wurzel, 'src/lib/katexBedarf.tsx'),
    'react-chartjs-2': path.resolve(wurzel, 'src/lib/chartBedarf.tsx'),
    'chart.js': path.resolve(wurzel, 'src/lib/chartJsBedarf.ts'),
  };
  const ausgenommen = new Set(Object.values(ersatz));
  return {
    name: 'bedarfs-laden',
    enforce: 'pre',
    resolveId(quelle, importer) {
      const ziel = ersatz[quelle];
      if (!ziel || !importer) return;
      const datei = importer.split('?')[0];
      if (!datei.startsWith(src) || ausgenommen.has(datei)) return;
      return ziel;
    },
  };
}
