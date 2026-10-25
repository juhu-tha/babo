# Architektur BaustoffBoard

Stand: Phase 5 (Oktober 2026). Kurzüberblick für Pflege und Weiterentwicklung.

## Aufbau

| Bereich | Ort | Aufgabe |
|---|---|---|
| Einstieg | `src/main.tsx` → `src/App.tsx` | Layout: Seitenleiste, Kopfzeile, Inhaltsrahmen, SEO-Metadaten, Druckkopf/-fuß |
| Registry | `src/registry/modules.ts`, `icons.ts` | **Einzige** Liste aller Modul-IDs mit Menügruppe, Icon, Meta-Beschreibung, Suchbegriffen und Baum-Angaben (Modulübersicht); Aliase in `TAB_ALIASES` |
| Routing | `src/routing/ModulInhalt.tsx` | Ordnet jeder Modul-ID die Komponente zu (`activeTab === '<id>' && <Modul />`), alle Module per `React.lazy` |
| | `src/routing/ModulKopf.tsx` | Lernziele, Kurzfassung, Erkundungsauftrag, Rechner-Haftungshinweis (lazy, mit den zugehörigen Daten) |
| | `src/routing/tabGroups.ts` | Menügruppen aus der Registry für die Navigation |
| Navigation | `src/components/navigation/ModulNavigation.tsx` | Menü der Seitenleiste (Start/Favoriten, Cluster, Gruppen, Volltexttreffer) |
| Zustand | `src/contexts/TabContext.tsx` | aktives Modul ↔ URL-Hash (`#modul_id`), Theme, Anzeigeoptionen |
| Module | `src/modules/*.tsx` | Fachmodule (Darstellung); große Teilansichten in Unterordnern (z. B. `modules/holz/HolzSchwinden3D.tsx`) |
| Rechenkerne | `src/calc/*.ts` | reine, getestete Rechenfunktionen ohne React (Tests in `tests/`) |
| Daten | `src/data/*` | Inhalte und Kennwerte (Quiz `quiz.json`, Lernziele, Erkundung, Rechnergrenzen, Versionen …) |
| Server | `server.ts` | Express: statische Auslieferung, Gemini-Proxy, Abstimmungen, Admin, `GET /api/health` |

Neues Modul: Eintrag in `src/registry/modules.ts` + Zeile in `src/routing/ModulInhalt.tsx` (lazy import und `activeTab === '<id>'`). `tests/registry.test.ts` prüft, dass jede ID dort verdrahtet ist, und dass `App.tsx` ≤ 800 Zeilen bleibt.

Fachmodule brauchen außerdem einen Prüfvermerk in `src/data/pruefvermerke.ts` (neu: `{ status: 'offen' }`; `tests/pruefvermerke.test.ts`). `ModulKopf` zeigt „Fachlich geprüft am … von …“ bzw. „Fachliche Prüfung ausstehend“; der Admin-Bereich („Meine Module“) listet alle Vermerke nach Cluster, Pate (`src/data/paten.ts`) und Status (Redaktionsmodell, AP 6.6).

## Ladeverhalten (Bundle-Budget)

- Einstiegs-Chunk enthält nur Layout, Navigation, Registry und React. Module, Modulkopf, Modul-Selbsttest (`quiz.json`), Abstimmungsansicht und SEO-Audit werden nachgeladen.
- three.js / @react-three nur in den 3D-Teilansichten von Holz und Mauerwerk (`React.lazy` innerhalb des Moduls).
- Große Teilansichten neuer Module ebenso per `React.lazy` + `<React.Suspense>` auslagern.
- `scripts/qa/check-bundle.mjs` prüft die gzip-Größen als Ratsche (Einstieg, jeder Chunk ≤ 300 kB; `quizData` mit eigener Grenze, bis `quiz.json` aufgeteilt ist).

## QA-Skripte

| Befehl | Prüfung |
|---|---|
| `npx tsc --noEmit` (`npm run lint`) | Typen |
| `npm test` | alle `tests/*.test.ts` (Registry, Rechenkerne, Daten, Sitemap …) |
| `npm run check:formeln` | KaTeX-Formeln |
| `npm run check:zahlen` | deutsches Zahlenformat |
| `npm run check:quellen` | Quellenangaben |
| `npm run build` + `node scripts/qa/check-bundle.mjs` | Build und Bundle-Budget |
| `node scripts/qa/check-verwaist.mjs [--strict]` | Dateien unter `src/`, die von `src/main.tsx` aus nicht erreichbar sind |
| `scripts/qa/a11y.mjs`, `layout-mobil.mjs` | Barrierefreiheit / Mobil-Layout (Playwright, eigener Workflow) |

Alle Prüfungen laufen in `.github/workflows/qa.yml` bei Push auf `main` und bei Pull Requests.

## Arbeitsablauf

- **GitHub ist die einzige Quelle** (single source of truth). Änderungen nur über Branches/Pull Requests mit grüner QA.
- **Google AI Studio nur zum Pull** von `main` und zum Veröffentlichen (Cloud Run) – dort keine Änderungen am Code.
- Abhängigkeiten: `renovate.json` (wöchentlich, Minor/Patch gebündelt, Label `dependencies`, kein Automerge); wirksam, sobald die Renovate-App für das Repository aktiviert ist.
- Betrieb: `GET /api/health` liefert `{ status, version, uptime }` ohne personenbezogene Daten. Client-IPs werden nur im Arbeitsspeicher der Anfragebegrenzung gehalten (abgelaufene Einträge werden regelmäßig entfernt), nicht geloggt oder gespeichert.
