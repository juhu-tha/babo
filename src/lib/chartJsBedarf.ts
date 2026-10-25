// Chart.js bei Bedarf (Phase 5, AP 5.5): Ersatz für 'chart.js' im Browser-Bundle der Module.
// Das Vite-Plugin scripts/bedarfsLaden.ts lenkt Wert-Importe von 'chart.js' aus src/ hierher um.
// Die Module nutzen aus 'chart.js' nur ChartJS.register(...) mit Bausteinen; hier werden die
// Bausteine als Platzhalter („Marken“) gesammelt und beim Laden von Chart.js (src/lib/chartBedarf.tsx)
// durch die echten Klassen ersetzt und registriert. Typen kommen weiterhin aus 'chart.js'.

export interface Marke { readonly __chartBaustein: string }
type Eintrag = Marke | object;

const warteschlange: Eintrag[] = [];
let registriere: ((eintraege: Eintrag[]) => void) | undefined;

export const Chart = {
  register(...eintraege: Eintrag[]) {
    if (registriere) registriere(eintraege);
    else warteschlange.push(...eintraege);
  },
};

/** von chartBedarf.tsx nach dem Laden aufgerufen: Warteschlange abarbeiten, künftig direkt registrieren */
export function verbinde(echteRegistrierung: (eintraege: Eintrag[]) => void) {
  registriere = echteRegistrierung;
  echteRegistrierung(warteschlange.splice(0));
}

export const istMarke = (e: unknown): e is Marke => typeof e === 'object' && e !== null && '__chartBaustein' in e;
const marke = (name: string): Marke => Object.freeze({ __chartBaustein: name });

export const CategoryScale = marke('CategoryScale');
export const LinearScale = marke('LinearScale');
export const LogarithmicScale = marke('LogarithmicScale');
export const RadialLinearScale = marke('RadialLinearScale');
export const TimeScale = marke('TimeScale');
export const PointElement = marke('PointElement');
export const LineElement = marke('LineElement');
export const BarElement = marke('BarElement');
export const ArcElement = marke('ArcElement');
export const LineController = marke('LineController');
export const BarController = marke('BarController');
export const ScatterController = marke('ScatterController');
export const RadarController = marke('RadarController');
export const PieController = marke('PieController');
export const DoughnutController = marke('DoughnutController');
export const PolarAreaController = marke('PolarAreaController');
export const BubbleController = marke('BubbleController');
export const Title = marke('Title');
export const SubTitle = marke('SubTitle');
export const Tooltip = marke('Tooltip');
export const Legend = marke('Legend');
export const Filler = marke('Filler');
export const Decimation = marke('Decimation');
export const Colors = marke('Colors');
