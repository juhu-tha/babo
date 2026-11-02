/**
 * Betriebsart der ausgelieferten Fassung (Entscheidung 02.11.2026: Vercel rein statisch, ohne Express-Server).
 *
 * Statik-Modus = Build mit BB_STATISCH=1 (vercel.json, buildCommand). vite.config.ts setzt dann __BB_STATISCH__
 * auf true – im Client-Build und im Vorrendern (gleiche Konfiguration), sodass vorgerendertes HTML und App
 * übereinstimmen. Ohne den Schalter (npm run build für npm start/Dockerfile, Tests mit tsx) gilt der
 * Serverbetrieb und alles bleibt wie bisher.
 *
 * Warum Build-Schalter statt Probe von /api/health: Eine Probe wäre selbst ein /api-Aufruf, der im statischen
 * Betrieb mit 404 antwortet und im Browser als Konsolenfehler erscheint; zudem stünde das Ergebnis erst nach
 * dem ersten Bild fest (Knöpfe erschienen und verschwänden wieder, Vorrendern und App wichen ab). Die
 * Betriebsart steht beim Bauen fest – Vercel baut immer statisch, Cloud Run/Docker immer mit Server.
 *
 * Im Statik-Modus abgeschaltet (keine /api-Aufrufe):
 *  - Besucherzähler (/api/analytics/visit) – Aufruf entfällt (src/App.tsx);
 *  - Kurzfragebogen (/api/feedback) – wird nicht eingeblendet (src/App.tsx);
 *  - Live-Abstimmung in den Vorlesungen und Abstimmungsansicht ?poll=… (/api/polls…) – ausgeblendet
 *    (src/modules/Vorlesungen.tsx, src/App.tsx);
 *  - Admin-Anmeldung und -Sitzung (/api/admin…) – Hinweis statt Anmeldeformular (src/modules/Admin.tsx);
 *  - KI-Analyse (/api/gemini/analyze) – zusätzlich zum zentralen Schalter aus (src/data/kiSchalter.ts).
 * tests/statikModus.test.ts prüft die Verdrahtung.
 */
declare const __BB_STATISCH__: boolean | undefined;

/** true im statischen Betrieb (ohne Server, alle /api-Adressen fehlen) */
export const STATISCH: boolean = typeof __BB_STATISCH__ === 'boolean' && __BB_STATISCH__;

/** Server-Funktionen (/api) vorhanden */
export const SERVER_FUNKTIONEN: boolean = !STATISCH;

/** Kurzhinweis, wo eine Server-Funktion sonst die Hauptsache einer Seite wäre (Admin-Bereich) */
export const HINWEIS_OHNE_SERVER = 'Dieser Bereich ist in der statisch veröffentlichten Fassung nicht verfügbar. Er steht nur im Betrieb mit eigenem Server zur Verfügung.';
