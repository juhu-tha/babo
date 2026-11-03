# Betrieb auf Vercel (statisch, ohne Server)

Entscheidung 02.11.2026 (Befunde B2, B3, B6, B7, B9 der Live-Prüfung: docs/pruefung/vercel-live-2026-11-02.md): Die Seite läuft auf Vercel (https://babo-zeta.vercel.app/) rein statisch; der Express-Server (`server.ts`) wird dort weggelassen, alle `/api`-Adressen antworten mit 404. Der Betrieb mit Server (`npm start`, `Dockerfile`, docs/betrieb-cloud-run.md) bleibt unverändert möglich.

## Dateien

| Datei | Zweck |
|---|---|
| `vercel.json` | Build-Befehl, Ausgabeordner `dist`, saubere Adressen, Weiterleitungen, Sicherheits- und Cache-Header |
| `scripts/vercelKonfig.ts` | erzeugt in `vercel.json` die Content-Security-Policy (Hashes der Inline-Skripte), die Weiterleitungen der Modul-Aliase und die noindex-Regeln; ohne Argument nur Prüfung |
| `src/data/betriebsart.ts` | Statik-Modus (`STATISCH`, `SERVER_FUNKTIONEN`) aus dem Build-Schalter `BB_STATISCH=1` |
| `scripts/qa/vercel-vorschau.mjs` | lokale Vorschau von `dist/` mit den Regeln aus `vercel.json`, ohne Express |
| `tests/statikModus.test.ts` | Regressionstest: Schalter, /api-Sperren, `vercel.json`, Ort des Server-Bundles |

## Build

`vercel.json` setzt den Build-Befehl (er hat Vorrang vor der Einstellung im Vercel-Projekt):

```
BB_STATISCH=1 npm run build && rm -f dist/server.cjs && cp dist/index.html dist/modul/admin.html && node scripts/seite404.mjs
```

- `npm run build` bleibt unverändert (package.json wird nicht angefasst) und erzeugt wie bisher `dist/server.cjs` für `Dockerfile`. `scripts/qa/check-bundle.mjs` verlangt `server.cjs` im Statik-Modus nicht (`BB_STATISCH=1`, `--statisch` oder `dist/404.html` vorhanden) und läuft damit auch auf der Vercel-Ausgabe.
- `rm -f dist/server.cjs`: Das Server-Bundle wird vor der Veröffentlichung entfernt (Befund 01.11.2026: `/server.cjs` war öffentlich abrufbar). Eine `.vercelignore` hilft hier nicht – sie wirkt nur auf die hochgeladenen Quelldateien, nicht auf die Build-Ausgabe.
- `cp dist/index.html dist/modul/admin.html`: `/modul/admin` wird nicht vorgerendert; als Datei liefert `cleanUrls` die Adresse mit Status 200 aus. Eine Umschreibung (`rewrites` auf `/index.html`) greift mit `cleanUrls` nicht – live 03.11.2026: Status 404 und Konsolenfehler (docs/pruefung/vercel-live-2026-11-03.md).
- `node scripts/seite404.mjs`: schreibt `dist/404.html` aus `dist/index.html` (Titel „Seite nicht gefunden“, `noindex`, Ersatzinhalt ohne JavaScript mit Links). Unbekannte Adressen bekommen damit die App mit Status 404; die App zeigt den Hinweis „Seite nicht gefunden“ mit ähnlichen Modulen und Suche (Gesamtgutachten 03.11.2026), die Adresse bleibt stehen. Die Inline-Skripte sind dieselben wie in `index.html` (CSP-Hashes unverändert).

## Statik-Modus

`BB_STATISCH=1` setzt in `vite.config.ts` die Konstante `__BB_STATISCH__` (Client-Build und Vorrendern). Ein Build-Schalter statt einer Probe von `/api/health`, weil die Probe selbst ein /api-Aufruf mit 404 und damit ein Konsolenfehler wäre und ihr Ergebnis erst nach dem ersten Bild feststünde. Abgeschaltet sind dann:

| Funktion | Endpunkt | Verhalten statisch |
|---|---|---|
| Besucherzähler | `/api/analytics/visit` | kein Aufruf |
| Kurzfragebogen | `/api/feedback` | wird nicht eingeblendet |
| Live-Abstimmung in den Vorlesungen, Abstimmungsansicht `?poll=…` | `/api/polls…` | ausgeblendet, `?poll=` öffnet die normale Seite |
| Admin-Anmeldung und -Sitzung | `/api/admin…` | Hinweis statt Anmeldeformular |
| KI-Analyse | `/api/gemini/analyze` | ohnehin abgeschaltet (`src/data/kiSchalter.ts`), statisch immer aus |

Neue `/api`-Aufrufe im Client meldet `tests/statikModus.test.ts`, bis sie hinter `SERVER_FUNKTIONEN` stehen.

## Adressen

- `cleanUrls`: `/modul/<id>` liefert die vorgerenderte `dist/modul/<id>.html`; `/modul/<id>.html` und `/index.html` leiten auf die saubere Adresse um, `trailingSlash: false` entfernt einen Schrägstrich am Ende.
- Aliase (`AKTIVE_ALIASE` in `src/registry/modules.ts`) und `/modul/start` → dauerhafte Weiterleitung (308) auf die kanonische Adresse.
- `/modul/admin` (nicht vorgerendert) → `dist/modul/admin.html` (Kopie von `index.html`, siehe Build).
- Unbekannte Modul-IDs, abgeschaltete Seiten (Lernpfade) und alle übrigen Adressen → `404.html` mit Status 404. Groß geschriebene IDs (`/modul/Glas`) zeigen ebenfalls die App mit Status 404; sie stellt die Adresse auf die kanonische Schreibweise um.

## Header

- Content-Security-Policy erzwungen (Begründung je Direktive in `scripts/vercelKonfig.ts`): `script-src` ohne `'unsafe-inline'`, die zwei Inline-Skripte per SHA-256; `frame-ancestors` erlaubt die Einbettung über baustoffboard.de. Kein `X-Frame-Options`, weil es diese Einbettung nicht zulassen könnte.
- `X-Content-Type-Options: nosniff`, `Referrer-Policy` und `Permissions-Policy` wie `server.ts`. `Strict-Transport-Security` setzt Vercel selbst (unter `*.vercel.app` `max-age=63072000; includeSubDomains; preload`); ein eigener Wert in `vercel.json` würde ihn abschwächen und ist deshalb entfernt (03.11.2026).
- `X-Robots-Tag: noindex` für alle Adressen unter `*.vercel.app` (Host-Bedingung `has`), solange baustoffboard.de die kanonische Adresse ist – `canonical` und Sitemap bleiben auf baustoffboard.de; außerdem für die abgeschalteten Seiten (Lernpfade, wie die Hinweisseite in `server.ts`).
- `/assets/*` (Dateinamen mit Hash): `public, max-age=31536000, immutable`; `/fonts/*`: eine Woche; alles andere Vercel-Standard (immer neu prüfen).

Rückweg bei CSP-Problemen: in `vercel.json` den Schlüssel `Content-Security-Policy` in `Content-Security-Policy-Report-Only` umbenennen (ein Commit).

## Pflege

- Nach Änderungen an `scripts/startschale-boot.js`, `scripts/vorladen-boot.js`, an den Aliasen oder an abgeschalteten Seiten: `npx tsx scripts/vercelKonfig.ts --schreiben` (sonst schlägt `npm test` fehl).
- Lokale Prüfung wie auf Vercel:

```
BB_STATISCH=1 npm run build && rm -f dist/server.cjs && cp dist/index.html dist/modul/admin.html && node scripts/seite404.mjs
PORT=4501 node scripts/qa/vercel-vorschau.mjs
```

## In Vercel prüfen (nach dem Merge, beim nächsten Deploy)

1. Projekt → Settings → Build and Deployment: Framework „Vite“, Output Directory `dist`; abweichende Angaben werden von `vercel.json` überschrieben, sollten aber nicht widersprechen.
2. Für den Statik-Modus ist nichts einzustellen: `BB_STATISCH=1` steht im Build-Befehl von `vercel.json`.
3. Settings → Environment Variables: keine Geheimnisse (`GEMINI_API_KEY`, `ADMIN_PASSWORD` u. a.) – sie werden statisch nicht gebraucht; insbesondere keine Variable mit Präfix `VITE_`, denn die landet im ausgelieferten JavaScript.
4. Nach dem Deploy: `https://babo-zeta.vercel.app/server.cjs` → 404; `/modul/glas` → 200; Antwort-Header enthalten `Content-Security-Policy`; `X-Robots-Tag: noindex` unter babo-zeta.vercel.app; Browser-Konsole auf Start- und Modulseiten ohne Fehler und ohne /api-Aufrufe.
