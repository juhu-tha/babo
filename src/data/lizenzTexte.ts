/**
 * Lizenztexte (AP 6.8) – nur aus nachgeladenen Chunks importieren (LicenseNotice, Impressum).
 * Der Schalter LIZENZ_AKTIV liegt allein in src/data/lizenz.ts. Keine Rechtsberatung.
 */
export { LIZENZ_AKTIV } from './lizenz';

export const LIZENZ = {
  werk: 'BaustoffBoard',
  werkUrl: 'https://www.baustoffboard.de',
  urheber: 'Prof. Dr.-Ing. Jürgen Huber',
  einrichtung: 'Technische Hochschule Augsburg',
  inhalte: {
    kurz: 'CC BY-SA 4.0',
    name: 'Creative Commons Namensnennung – Weitergabe unter gleichen Bedingungen 4.0 International',
    url: 'https://creativecommons.org/licenses/by-sa/4.0/deed.de',
    rechtstext: 'https://creativecommons.org/licenses/by-sa/4.0/legalcode.de',
  },
  code: {
    kurz: 'MIT',
    name: 'MIT-Lizenz',
    url: 'https://opensource.org/license/mit',
  },
} as const;

/** Empfohlene Namensnennung (TULLU: Titel, Urheber, Lizenz, Link, Ursprungsort) zum Kopieren */
export const NAMENSNENNUNG =
  `„${LIZENZ.werk}“ von ${LIZENZ.urheber} (${LIZENZ.einrichtung}), ${LIZENZ.werkUrl}, ` +
  `lizenziert unter ${LIZENZ.inhalte.kurz} (${LIZENZ.inhalte.url})`;

/** Ausnahmen von der offenen Lizenz (Kurzform; vollständige Liste in docs/lizenz-inventur.md) */
export const LIZENZ_AUSNAHMEN =
  'Ausgenommen sind Inhalte Dritter: Auszüge, Tabellenwerte und Begriffe aus Normen und Regelwerken ' +
  '(DIN, EN, ISO, Eurocode, VDI, WTA u. a.; Urheberrecht der Normungsorganisationen bzw. Verlage), ' +
  'gekennzeichnete Zitate, Marken und Logos sowie die Schrift Inter (SIL Open Font License 1.1). ' +
  'Für sie gelten die Rechte der jeweiligen Inhaber.';

/** Urheberrechtsabsatz im Impressum, sobald LIZENZ_AKTIV = true (ersetzt „schriftliche Zustimmung“) */
export const IMPRESSUM_URHEBERRECHT_OFFEN =
  `Die Inhalte dieser Anwendung (Texte, Aufgaben, eigene Grafiken) stehen unter ${LIZENZ.inhalte.name} ` +
  `(${LIZENZ.inhalte.kurz}), der Quellcode unter der ${LIZENZ.code.name}. ${LIZENZ_AUSNAHMEN} ` +
  'DIN, EN, ISO, Eurocode und DIBt sind eingetragene Bezeichnungen bzw. Marken der jeweiligen Organisationen; ' +
  'ihre Nennung und der Verweis auf Formeln und Grenzwerte dienen der Erläuterung und dem Beleg (§ 51 UrhG).';

/** Eine Komponente Dritter mit ihrer Lizenz (Drittlizenzliste im Impressum, unabhängig von LIZENZ_AKTIV) */
export interface Drittkomponente {
  name: string;
  /** npm-Paket(e); die Lizenzangabe wird in tests/lizenz.test.ts gegen node_modules/<paket>/package.json geprüft */
  pakete?: readonly string[];
  zweck: string;
  /** SPDX-Kennung */
  lizenz: keyof typeof LIZENZ_LINKS;
  url: string;
  /** im Browser ausgeliefert (sonst nur auf dem Server) */
  imBrowser: boolean;
}

/** SPDX-Kennung → Lizenztext */
export const LIZENZ_LINKS = {
  'OFL-1.1': 'https://openfontlicense.org',
  MIT: 'https://opensource.org/license/mit',
  ISC: 'https://opensource.org/license/isc',
  'Apache-2.0': 'https://www.apache.org/licenses/LICENSE-2.0',
  'BSD-2-Clause': 'https://opensource.org/license/bsd-2-clause',
} as const;

/**
 * Drittlizenzliste (Gutachten 27.10.2026 abends, Maßnahme 7; Bestand in docs/lizenz-inventur.md, Abschn. 1).
 * Lizenzangaben aus den package.json-Dateien der installierten Pakete bzw. der Name-Tabelle der Schrift (ID 14).
 * Diese Komponenten behalten ihre eigene Lizenz; die Projektlizenz (LIZENZ) gilt für sie nicht.
 * Wird ein Laufzeitpaket ergänzt oder entfernt, diese Liste und docs/lizenz-inventur.md nachziehen.
 */
export const DRITTKOMPONENTEN: readonly Drittkomponente[] = [
  { name: 'Inter (Schrift)', zweck: 'Schrift der Oberfläche (Teilmenge, WOFF2)', lizenz: 'OFL-1.1', url: 'https://github.com/rsms/inter', imBrowser: true },
  { name: 'KaTeX', pakete: ['katex', 'react-katex'], zweck: 'Formelsatz einschließlich der KaTeX-Schriften', lizenz: 'MIT', url: 'https://katex.org', imBrowser: true },
  { name: 'Lucide (Icons)', pakete: ['lucide-react'], zweck: 'Symbole der Oberfläche und Favicon', lizenz: 'ISC', url: 'https://lucide.dev', imBrowser: true },
  { name: 'React', pakete: ['react', 'react-dom'], zweck: 'Oberfläche', lizenz: 'MIT', url: 'https://react.dev', imBrowser: true },
  { name: 'three.js, React Three Fiber, Drei', pakete: ['three', '@react-three/fiber', '@react-three/drei'], zweck: '3D-Ansichten', lizenz: 'MIT', url: 'https://threejs.org', imBrowser: true },
  { name: 'Chart.js, react-chartjs-2', pakete: ['chart.js', 'react-chartjs-2'], zweck: 'Diagramme', lizenz: 'MIT', url: 'https://www.chartjs.org', imBrowser: true },
  { name: 'Recharts', pakete: ['recharts'], zweck: 'Diagramme der Quiz-Auswertung', lizenz: 'MIT', url: 'https://github.com/recharts/recharts', imBrowser: true },
  { name: 'Motion', pakete: ['motion'], zweck: 'Animationen', lizenz: 'MIT', url: 'https://motion.dev', imBrowser: true },
  { name: 'react-markdown', pakete: ['react-markdown'], zweck: 'Darstellung von Texten', lizenz: 'MIT', url: 'https://github.com/remarkjs/react-markdown', imBrowser: true },
  { name: 'jsPDF', pakete: ['jspdf'], zweck: 'PDF-Export', lizenz: 'MIT', url: 'https://github.com/parallax/jsPDF', imBrowser: true },
  { name: 'html-to-image', pakete: ['html-to-image'], zweck: 'Bildexport von Diagrammen', lizenz: 'MIT', url: 'https://github.com/bubkoo/html-to-image', imBrowser: true },
  { name: 'SheetJS Community Edition', pakete: ['xlsx'], zweck: 'Excel-Export (erst beim Herunterladen geladen)', lizenz: 'Apache-2.0', url: 'https://sheetjs.com', imBrowser: true },
  { name: 'node-qrcode', pakete: ['qrcode'], zweck: 'QR-Codes', lizenz: 'MIT', url: 'https://github.com/soldair/node-qrcode', imBrowser: true },
  { name: 'Tailwind CSS, clsx, tailwind-merge', pakete: ['tailwindcss', 'clsx', 'tailwind-merge'], zweck: 'Gestaltung (erzeugtes CSS, Klassenhilfen)', lizenz: 'MIT', url: 'https://tailwindcss.com', imBrowser: true },
  { name: 'Express, compression', pakete: ['express', 'compression'], zweck: 'Webserver', lizenz: 'MIT', url: 'https://expressjs.com', imBrowser: false },
  { name: 'Google Gen AI SDK', pakete: ['@google/genai'], zweck: 'KI-Schnittstelle des Servers (derzeit abgeschaltet)', lizenz: 'Apache-2.0', url: 'https://github.com/googleapis/js-genai', imBrowser: false },
];
