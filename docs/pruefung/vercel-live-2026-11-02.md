# Live-Prüfung Vercel (https://babo-zeta.vercel.app/) – 02.11.2026

Rahmen: Grundsatzentscheidung 02.11.2026 – die Seite läuft auf Vercel rein statisch, der Express-Server (`server.ts`) ist dort weggelassen; alle `/api`-Adressen antworten mit 404. Geprüft wurde nur lesend (keine Formulare abgesendet, kein Anmeldeversuch, höchstens 2 parallele Seiten, Pausen zwischen den Abrufen). Live-Stand: v4.4.0 (Build 01.11.2026). Vergleichs-Build: `origin/main` (#289) in diesem Branch.

Werkzeuge: Playwright (Chromium), curl. Prüfskripte lagen außerhalb des Repos (Arbeitsordner); Messung der Ladezeit mit `scripts/qa/perf-messung.mjs --basis https://babo-zeta.vercel.app/ --hash-links`.

## Zusammenfassung

| Nr. | Befund | Schwere | Status |
|---|---|---|---|
| B1 | `/modul/<id>.html` (vorgerenderte Seite) zeigt nach dem Laden die **Startseite** statt des Moduls (288 von 288) – die App erkannte die Endung `.html` nicht | hoch | **im Code behoben** (dieser PR) |
| B2 | `/modul/<id>` ohne `.html` → Vercel-404 (`NOT_FOUND`, Klartext). Betrifft Neuladen jeder Modulseite, geteilte/kopierte Adressen, alle Links der Startseiten-Schale und der vorgerenderten Seiten (Mittelklick/neuer Tab), Sitemap-Adressen, Aliase und QR-Codes der Live-Abstimmung auf Unterseiten | hoch | Vorschlag `vercel.json` (Überschneidung mit `betrieb/vercel-statisch-11-02`) |
| B3 | Unbekannte Pfade → Vercel-Standard-404 (englisch, ohne Rahmen der Seite) statt App bzw. eigener 404-Seite | mittel | Vorschlag `vercel.json` (Überschneidung) |
| B4 | Sicherheits-Header fehlen bis auf HSTS (kein CSP/Report-Only, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, Schutz gegen Einbetten) | mittel | Vorschlag `vercel.json` (Überschneidung) |
| B5 | `/server.cjs` (Express-Bundle, 30 kB) öffentlich abrufbar; enthält keine Geheimnisse (nur Namen von Umgebungsvariablen), legt aber API-Logik und Ratenbegrenzungen offen | niedrig | Vorschlag (Build-Befehl/Ausschluss in `vercel.json`, Überschneidung) |
| B6 | Zwischenspeicherung: auch `/assets/*` (Dateien mit Hash) mit `public, max-age=0, must-revalidate` statt `max-age=31536000, immutable` wie in `server.ts` | mittel (Ladezeit bei Wiederkehr) | Vorschlag `vercel.json` (Überschneidung) |
| B7 | Je Seitenaufruf ein `POST /api/analytics/visit` → 404 mit Konsolenmeldung „Failed to load resource“; Live-Abstimmung in 5 Vorlesungsmodulen ruft `/api/polls/<id>` → 404 | Server weggelassen | gezählt, Vorschlag unten |
| B8 | `sitemap.xml`, `robots.txt`, `canonical` und `og:url` nennen weiter **baustoffboard.de** | Hinweis | gemeldet (beabsichtigt, solange die Domain die Zieladresse ist) |
| B9 | `*.vercel.app` ist indexierbar (kein `X-Robots-Tag: noindex`); `canonical` auf baustoffboard.de mildert doppelte Inhalte | niedrig | Vorschlag (Überschneidung) |
| B10 | KaTeX-Warnung „No character metrics for ‘‰’“ einmal im Modul `mechanische_kenngroessen` (beim Wechsel aus dem Client-Routing; im ruhenden DOM keine Formel mit ‰ gefunden) | niedrig | beobachten |

Keine fehlenden Assets, Schriften, Bilder oder Suchindex-Abrufe; keine Seitenfehler (`pageerror`); keine `.katex-error`; kein waagrechtes Scrollen bei 390 px in der Stichprobe.

## 1. Modulrouten

Liste: `dist/modul/routen.json` (live und lokal identisch: 288 IDs, 52 Aliase, 9 inaktive).

| Prüfung | Seiten | HTTP | Endadresse | Konsolenfehler (ohne API) | fehlgeschlagene Abrufe (ohne API) | `/api`-404 (Server weggelassen) | KaTeX-Fehler | kaputte Bilder |
|---|---:|---|---|---:|---:|---:|---:|---:|
| direkt `/modul/<id>.html` | 288 | 288 × 200 | **288 × `/` (Startseite)** → B1 | 0 | 0 | 288 (`/api/analytics/visit`) | 0 | 0 |
| Client-Routing (Start laden, dann `pushState` + `popstate` je Modul) | 288 + Start | – | 288 × `/modul/<id>` | 1 Warnung (B10) | 0 | 6 (1 × `analytics/visit`, 5 × `polls/<id>`) | 0 | 0 |
| direkt `/modul/<id>` (ohne Endung) | Stichprobe 3 | 404 (Vercel) | – | – | – | – | – | – |
| alte Hash-Links `/#glas` | 1 | 200 | `/modul/glas`, Modul sichtbar | 0 | 0 | 1 | 0 | 0 |

`/api`-404 nach Adresse:

| Adresse | Auslöser | Anzahl im Lauf |
|---|---|---:|
| `POST /api/analytics/visit` | jeder vollständige Seitenaufruf (`src/App.tsx`) | 1 je Aufruf |
| `GET /api/polls/<id>` | `vl_bauen_im_bestand`, `vl_nachhaltiges_bauen`, `vl_bauschaeden`, `vl_baustoffkunde`, `vl_instandhaltung` | 5 |
| `/api/feedback`, `/api/feedback/stats`, `/api/admin/*`, `/api/gemini/analyze` | nur bei Absenden bzw. Anmelden – nicht ausgelöst | – |

Assets: alle 470 in `dist/index.html` und der Vorlade-Karte genannten Dateien live 200; Schriften (`/fonts/*.ttf`, KaTeX-Schriften unter `/assets/`), `suchindex.json` (1,1 MB), `manifest.webmanifest`, `favicon.svg` 200.

### B1 – Ursache und Behebung

Vercel liefert die vorgerenderte Datei unter `/modul/glas.html` aus. `tabAusPfad` (`src/routing/pfad.ts`) und die Inline-Skripte `scripts/startschale-boot.js`/`scripts/vorladen-boot.js` erkannten nur `/modul/<id>`; aus `glas.html` wurde eine unbekannte ID, die App fiel auf die Startseite zurück, die vorgerenderte Schale blieb unsichtbar und das Vorladen der Modul-Chunks entfiel.

Behebung: Pfadregel `/^\/modul\/([^/]+?)(?:\.html)?\/?$/` an allen drei Stellen (Gleichlauf prüft `tests/pfadRouting.test.ts`, neuer Fall `/modul/glas.html` → `glas`). Geprüft am lokalen Build über einen rein statischen Dateiserver (wie Vercel ohne Umschreibregeln): `/modul/glas.html`, `/modul/oekobilanz_lca.html`, `/modul/statistik.html` zeigen das Modul (h1 und Titel des Moduls). Die App schreibt die Adresse danach wie bisher auf `/modul/<id>` um – Neuladen funktioniert erst mit B2.

## 2. Stichprobe (Startwert 20261102, mulberry32 über die 288 IDs)

| Modul | Reiter geklickt | KaTeX (Formeln / Fehler) | Rechner bedient | mobil 390 px hell | mobil 390 px dunkel | Konsole/Abrufe (ohne API) |
|---|---|---|---|---|---|---|
| `statistik` | 4/4 ✓ | bis 25 / 0 | „Festigkeit (editierbar), 1“ 30,5 → 44,7, Ergebnis ändert sich ✓ | 390 = 390 ✓ | ✓ (`html.dark`, Hintergrund dunkel) | 0 |
| `materialoptimierung` | 3/3 ✓ | 26 / 0 | kein Eingabefeld | ✓ | ✓ | 0 |
| `bp_betonfertigteile` | 3/3 ✓ | 1 / 0 | kein Eingabefeld | ✓ | ✓ | 0 |
| `holzbau_bemessung` | keine Reiter | 24 / 0 | „Stützenbreite b (mm)“ 120 → 170 ✓ | ✓ | ✓ | 0 |
| `bp_verkehr_pruefung` | 6/6 Hauptreiter ✓ (Unterreiter „Asphalt“ nicht einzeln) | bis 11 / 0 | „Vortriebs-Aussenradius (R)“ 4,5 → 5,5 m ✓ | ✓ | ✓ | 0 |

Dunkelmodus folgt der Systemeinstellung (`prefers-color-scheme`), Hellmodus ohne dunkle Flächen im Inhalt (Bildschirmfotos gesichtet). Je Modul 3 × `/api/analytics/visit` (je Seitenaufruf).

## 3. Deep-Links, Neuladen, Teilen, Sitemap/robots

| Adresse | Ergebnis live | erwartet |
|---|---|---|
| `/` und `/index.html` | 200, Startseite | ✓ |
| `/modul/glas.html` | 200, aber Startseite (B1, behoben) | Modul |
| `/modul/glas`, `/modul/GLAS`, Alias | 404 Vercel (B2) | Modul bzw. 301 auf kanonische Adresse |
| Neuladen auf `/modul/glas` nach Navigation | 404 Vercel (B2) | Modul |
| Teilen: Adresszeile/`og:url` (`/modul/<id>`), QR der Live-Abstimmung (`origin + pathname + ?poll=`) | Adresse 404 (B2); Abstimmung zusätzlich ohne Server | – |
| `/#glas` (alte QR-Codes in Folien) | Modul, Adresse wird `/modul/glas` | ✓ |
| `/#gibtsnicht` | Startseite | ✓ |
| `/modul/unbekannt`, `/gibtsnicht` | Vercel-404 englisch (B3) | eigene 404 bzw. App |
| `/sitemap.xml` | 200, 286 Adressen, alle `https://baustoffboard.de/…` ohne `.html`, `lastmod` 2026-11-01 | Domain melden (B8) |
| `/robots.txt` | 200, `Allow: /`, Sitemaps auf baustoffboard.de und www.baustoffboard.de | Domain melden (B8) |

## 4. Sicherheit

Header (Startseite, Asset):

| Header | live | `server.ts` (bisher) |
|---|---|---|
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` (Vercel) | `max-age=31536000` |
| `Content-Security-Policy(-Report-Only)` | fehlt | Report-Only mit Hashes der Inline-Skripte |
| `X-Content-Type-Options` | fehlt | `nosniff` |
| `Referrer-Policy` | fehlt | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | fehlt | `camera=(), microphone=(), geolocation=(), payment=()` |
| `Access-Control-Allow-Origin` | `*` (Vercel-Standard für statische Dateien) | nicht gesetzt |
| `Cache-Control` `/assets/*` | `public, max-age=0, must-revalidate` (B6) | `max-age=31536000, immutable` |
| Kompression | Brotli | gzip |

Öffentlich abrufbare Dateien (Repo-`dist` gegen live):

| Datei | live | soll öffentlich? |
|---|---|---|
| `index.html`, `modul/*.html` (288), `assets/*` (alle geprüften 470), `fonts/*`, `boot/*.js`, `favicon.svg`, `manifest.webmanifest`, `robots.txt`, `sitemap.xml`, `suchindex.json` | 200 | ja |
| `modul/routen.json` (Liste/Aliase/inaktive IDs, 12 kB) | 200 | unkritisch; wird statisch nicht gebraucht (nur `server.ts`), könnte aber für Umschreibregeln dienen |
| `audit-bundle.json` (`{"einstiegGzipKB":94.3,"gemessenAm":"2026-11-01"}`) | 200 | unkritisch |
| `server.cjs` | 200 (`application/node`) | **nein** (B5) |
| `/assets/` (Verzeichnis) | 200, liefert den Chunk `index.es-*.js` aus (Verzeichnis-Index von Vercel) | harmlos (Datei ist ohnehin öffentlich) |
| Quelltext, `.env*`, `.git/*`, `package.json`, Quellkarten (`*.map`), `.vorrendern/` | 404 | ✓ |

Geheimnisse in Bundles: alle 470 Live-Chunks, `index.html` und der lokale `dist` auf typische Schlüsselmuster (Google-API-, OpenAI-, GitHub-, AWS-, Slack-Schlüssel, private Schlüssel, JWT) und auf `password/secret/token/api_key = "…"` durchsucht. Treffer: nur ein Lehrbeispiel im Modul KI (lokaler LM-Studio-Platzhalter `api_key="lm-s…"` für `localhost`) und ein Preistext („Token:“) – **kein Geheimnis**. `server.cjs` liest `GEMINI_API_KEY`, `ADMIN_PASSWORD`, `POLL_ADMIN_PASSWORD` nur aus der Umgebung, ohne Vorgabewerte.

## 5. Ladezeit

Ziele aus `docs/performance.md` (AP 5.4/5.5): LCP < 2,5 s, CLS < 0,1, TBT ≈ < 200 ms, Klick-Latenz < 200 ms – gemessen unter Mobil-Emulation „Fast 3G“ + 4× CPU-Drosselung, 3 Läufe, Median.

Live, gleiches Verfahren (`perf-messung.mjs`). Module über alte Hash-Links (`/#<id>`), weil `/modul/<id>` live 404 liefert und `/modul/<id>.html` vor B1 die Startseite zeigt – gemessen ist daher das Laden **ohne** vorgerenderte Modulseite:

| Seite | FCP | LCP (Ziel < 2,5 s) | CLS | TBT ≈ | Klick | Übertragen | Referenz 26.10. (lokal, Express, HTTP/1.1) LCP |
|---|---:|---:|---:|---:|---:|---:|---:|
| start | 2,40 s | 2,40 s ✓ | 0,000 ✓ | 134 ms ✓ | 56 ms ✓ | 519 kB | 2,06 s |
| mischungsberechnung | 3,46 s | 4,08 s ✗ | 0,000 ✓ | 399 ms ✗ | 64 ms ✓ | 612 kB | 3,60 s |
| glas | 3,47 s | 3,90 s ✗ | 0,000 ✓ | 172 ms ✓ | 40 ms ✓ | 617 kB | 3,48 s |
| oekobilanz_lca | 3,67 s | 4,19 s ✗ | 0,000 ✓ | 177 ms ✓ | 64 ms ✓ | 706 kB | 3,69 s |

Ohne Drosselung (Desktop 1280 × 900, Netz dieser Prüfumgebung zum Vercel-Rechenzentrum iad1, Median aus 3):

| Seite | TTFB | FCP | LCP | load |
|---|---:|---:|---:|---:|
| `/` | 142 ms | 552 ms | 840 ms | 1100 ms |
| `/#mischungsberechnung` | 154 ms | 672 ms | 1080 ms | 1363 ms |
| `/#glas` | 178 ms | 592 ms | 1012 ms | 1413 ms |
| `/#oekobilanz_lca` | 122 ms | 580 ms | 964 ms | 1684 ms |

Bewertung: Startseite im Ziel. Module wie in AP 5.5 dokumentiert über dem Ziel; live 0,3–0,5 s langsamer als die lokale Referenz (reale Netzlaufzeit zum Rechenzentrum kommt zur emulierten RTT hinzu; die Startseite überträgt live 519 statt 381 kB – Ursache nicht untersucht). Der Hauptgewinn der vorgerenderten Modulseiten (Z52) kommt live erst mit B1 (behoben) **und** B2 (Umschreibregel) an; danach Messung mit `/modul/<id>` wiederholen. TBT Mischungsberechnung (399 ms) streut wie in AP 5.5 beschrieben stark.

## Vorschläge (nicht im Code dieses PR)

Alle betreffen `vercel.json` und damit den Branch `betrieb/vercel-statisch-11-02` (nur gemeldet):

1. **B2:** `"cleanUrls": true` (dann `/modul/glas` → `glas.html`, `/modul/glas.html` → 308 auf `/modul/glas`) oder Umschreibregel `{"source": "/modul/:id", "destination": "/modul/:id.html"}`; Aliase und Großschreibung aus `dist/modul/routen.json` als `redirects` (301) erzeugen, inaktive IDs als 404 mit `X-Robots-Tag: noindex`. Fallback für unbekannte IDs unter `/modul/` auf `/index.html` (App zeigt Start) oder eigene 404.
2. **B3:** eigene `404.html` im `dist` (z. B. beim Build aus `index.html` mit Hinweis) – Vercel liefert sie für unbekannte Pfade automatisch aus.
3. **B4:** Header aus `securityHeaders` (`server.ts`) in `vercel.json` übernehmen; die CSP-Hashes der Inline-Skripte ändern sich je Build und müssten beim Build erzeugt werden (oder vorerst ohne CSP).
4. **B5:** `server.cjs` nicht ins Ausgabeverzeichnis von Vercel (eigener `buildCommand` nur `vite build`, oder Umschreibung von `/server.cjs` auf 404).
5. **B6:** `headers` für `/assets/(.*)`: `public, max-age=31536000, immutable`; Schriften/Bilder `max-age=604800`.
6. **B9:** auf `*.vercel.app` `X-Robots-Tag: noindex` setzen, solange baustoffboard.de die kanonische Domain ist.

Code (Entscheidung erbeten):

7. **B7:** Ohne Server die API-Aufrufe gar nicht absetzen – z. B. Build-Schalter `VITE_OHNE_SERVER=1` (auf Vercel gesetzt), der `analytics/visit` auslässt und Live-Abstimmung, Kurzfragebogen, Admin-Anmeldung und KI-Analyse mit Hinweis „auf dieser Bereitstellung nicht verfügbar“ statt Fehler zeigt. Vorschlag: so umsetzen, sobald B2 steht.
8. **B8:** Domain bleibt baustoffboard.de (kanonisch). Falls die Vercel-Adresse dauerhaft die öffentliche wird: `BASIS_URL` in `scripts/vorrendern.ts`, `public/robots.txt`, Sitemap-Erzeugung und `index.html` (`canonical`, `og:url`, JSON-LD) gemeinsam umstellen.
