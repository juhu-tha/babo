// Zentrale Registrierung der Chart.js-Bausteine. Wird von jedem Modul mit react-chartjs-2
// importiert, damit Chart.js nicht im Start-Bundle landet.
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
  RadialLinearScale
} from 'chart.js';

// Barrierefreiheit: Canvas mit role="img" erhält einen Namen (Diagrammtitel oder Datensatznamen) – nur als Rückfall:
// Im Browser setzt die Diagrammhülle (src/lib/diagrammAlternative.tsx, Paket Z8) schon eine ausführlichere Beschreibung.
const a11yLabel = {
  id: 'a11yLabel',
  afterInit(chart: ChartJS) {
    if (chart.canvas.getAttribute('aria-label')) return;
    const t = chart.options.plugins?.title?.text;
    const titel = Array.isArray(t) ? t.join(' ') : t;
    const reihen = chart.data.datasets.map(d => d.label).filter(Boolean).join(', ');
    chart.canvas.setAttribute('aria-label', titel || (reihen ? `Diagramm: ${reihen}` : 'Diagramm'));
  },
};

ChartJS.register(
  a11yLabel,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
  RadialLinearScale
);
