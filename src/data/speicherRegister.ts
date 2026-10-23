/**
 * Register aller Speicherorte im Browser und aller Cookies (Umsetzungsplan Phase 1, AP 1.3).
 * Die Datenschutzerklärung zeigt diese Tabelle an; tests/speicherRegister.test.ts prüft,
 * dass jeder im Code verwendete Schlüssel hier eingetragen ist.
 */
export interface SpeicherEintrag {
  schluessel: string;
  ort: 'localStorage' | 'sessionStorage' | 'Cookie (Server)' | 'Cookie (Browser)';
  zweck: string;
  dauer: string;
}

const BIS_LOESCHUNG = 'bis zur Löschung im Browser';
const SITZUNG = 'bis zum Schließen des Browser-Tabs';

export const SPEICHER_REGISTER: SpeicherEintrag[] = [
  // Bedienung und Darstellung
  { schluessel: 'theme', ort: 'localStorage', zweck: 'Hell- oder Dunkelmodus', dauer: BIS_LOESCHUNG },
  { schluessel: 'baustoffboard_lang', ort: 'localStorage', zweck: 'gewählte Sprache', dauer: BIS_LOESCHUNG },
  { schluessel: 'th_bauboard_a11y_prefs', ort: 'localStorage', zweck: 'Einstellungen zur Barrierefreiheit (Schriftgröße, Kontrast, Bewegung)', dauer: BIS_LOESCHUNG },
  { schluessel: 'baustoffboard_screen_width', ort: 'localStorage', zweck: 'gewählte Seitenbreite', dauer: BIS_LOESCHUNG },
  { schluessel: 'baustoffboard_fluid_width', ort: 'localStorage', zweck: 'Seitenbreite (ältere Einstellung, wird übernommen)', dauer: BIS_LOESCHUNG },
  { schluessel: 'baustoffboard_tooltip_mode', ort: 'localStorage', zweck: 'Erklärungen zu Fachbegriffen ein/aus', dauer: BIS_LOESCHUNG },
  { schluessel: 'baustoffboard_derivation_mode', ort: 'localStorage', zweck: 'Rechenwege ein/aus', dauer: BIS_LOESCHUNG },
  { schluessel: 'baustoffboard_favorites', ort: 'localStorage', zweck: 'als Favorit markierte Module', dauer: BIS_LOESCHUNG },
  { schluessel: 'baustoffboard_recent', ort: 'localStorage', zweck: 'zuletzt besuchte Module', dauer: BIS_LOESCHUNG },
  { schluessel: 'dauerhaftigkeit_subtab', ort: 'localStorage', zweck: 'zuletzt geöffneter Reiter im Modul Dauerhaftigkeit', dauer: BIS_LOESCHUNG },
  // Lernen
  { schluessel: 'tha_study_phase', ort: 'localStorage', zweck: 'gewählte Lernphase', dauer: BIS_LOESCHUNG },
  { schluessel: 'tha_bookmarked_tabs', ort: 'localStorage', zweck: 'Lesezeichen', dauer: BIS_LOESCHUNG },
  { schluessel: 'tha_bloom_completed', ort: 'localStorage', zweck: 'als erledigt markierte Lernziele', dauer: BIS_LOESCHUNG },
  { schluessel: 'tha_klausur_history', ort: 'localStorage', zweck: 'eigene Ergebnisse im Klausursimulator', dauer: BIS_LOESCHUNG },
  { schluessel: 'tha_quiz_session_history', ort: 'localStorage', zweck: 'eigene Quiz-Ergebnisse', dauer: BIS_LOESCHUNG },
  { schluessel: 'tha_quiz_active_gaps', ort: 'localStorage', zweck: 'erkannte Wissenslücken für Lernempfehlungen', dauer: BIS_LOESCHUNG },
  { schluessel: 'tha_lab_protocols_history', ort: 'localStorage', zweck: 'eigene Laborprotokolle', dauer: BIS_LOESCHUNG },
  { schluessel: 'bau_bautagebuch_diaries', ort: 'localStorage', zweck: 'eigene Einträge im Bautagebuch (Projekt- und Notizdaten, die Sie selbst eingeben)', dauer: BIS_LOESCHUNG },
  // Verwaltung
  { schluessel: 'bb_admin_token', ort: 'sessionStorage', zweck: 'Anmeldung im Admin-Bereich (nur Lehrende)', dauer: SITZUNG },
  { schluessel: 'tha_admin_authenticated', ort: 'sessionStorage', zweck: 'veralteter Anmeldestatus, wird beim Abmelden entfernt', dauer: SITZUNG },
  // Cookies
  { schluessel: 'bb_voter', ort: 'Cookie (Server)', zweck: 'zufällige Kennung, damit pro Gerät nur einmal an einer Live-Abstimmung teilgenommen wird; technisch notwendig (§ 25 Abs. 2 Nr. 2 TDDDG)', dauer: '12 Stunden' },
  { schluessel: 'googtrans', ort: 'Cookie (Browser)', zweck: 'gewählte Zielsprache der Google-Übersetzung; wird erst gesetzt, wenn Sie die Übersetzung aktivieren', dauer: 'bis zum Deaktivieren der Übersetzung' },
];
