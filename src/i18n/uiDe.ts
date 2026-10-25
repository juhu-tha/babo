// Deutsche UI-Texte (Einstieg). Englische Übersetzungen in ./translations.ts werden nur bei Bedarf geladen.
import type { UI_EN } from './translations';

export const UI_DE: Record<keyof typeof UI_EN, string> = {
  appName: "BaustoffBoard THA",
  dashboard: "Dashboard-Übersicht",
  searchPlaceholder: "Modul, Norm oder Stichwort suchen...",
  clearSearch: "Leeren",
  backToStart: "Zur Startseite",
  allModules: "Alle Module",
  favorites: "Favoriten",
  noFavorites: "Noch keine Favoriten gespeichert. Klicken Sie auf das Sternsymbol neben einem Modul.",
  recentTabs: "Zuletzt geöffnet",
  themeDark: "Dunkel",
  themeLight: "Hell",
  exportPdf: "PDF-Export",
  exporting: "Exportiere...",
  languageToggle: "Sprache: DE",
  disclaimer: "Nur für akademische & didaktische Zwecke.",
  close: "Schließen",
  filter: "Filter",
  openModule: "Modul öffnen",
  testProtocol: "Prüfprotokoll",
  date: "Datum",
  openAudit: "Metadaten-Audit",
  quickTranslateNotice: "Englisch-Modus aktiv: Benutzeroberfläche und Navigation auf Englisch. Klicken Sie unten für die Tiefenübersetzung via Google Translate.",
  translateContentBtn: "Inhalte übersetzen",
  revertToGermanBtn: "Originale deutsche Inhalte"
};
