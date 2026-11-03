# Live-Nachprüfung Vercel (https://babo-zeta.vercel.app/) – 03.11.2026

Anlass: Merges #294–#313 (Statik-Modus, `vercel.json`, vorgerenderte Seiten hell/dunkel/breit). Vergleich mit dem Bericht vom Vortag: docs/pruefung/vercel-live-2026-11-02.md (Befunde B1–B10). Geprüft wurde nur lesend: keine Formulare, kein Anmeldeversuch, höchstens 2 Seiten gleichzeitig, Pausen zwischen den Abrufen. Werkzeuge: Playwright (Chromium 1194), curl; Ladezeit mit `scripts/qa/perf-messung.mjs`.

## Zusammenfassung

| Nr. | Befund | Schwere | Status |
|---|---|---|---|
| L1 | Live-Stand: bis 23:11 UTC am 02.11. lief noch der Stand von #294 (CSP-Hash der Startschale vor #310); die Vercel-Deploys von #310/#312 für das Projekt hinter babo-zeta waren mit „Deployment rate limited – retry in 24 hours“ abgebrochen. Um 23:11 UTC wurde `origin/main` (d53de8e0, #313) deployt; ab da geprüft | Betrieb | erledigt (live = main); Ursache siehe L2 |
| L2 | Drei Vercel-Projekte (`babo`, `babo-9xka`, `babo-i1nu`) bauen jeden Push; das verbraucht das Tageskontingent dreifach und führte am 02.11. zur Sperre | mittel (Betrieb) | Frage an Prof. Huber (unten) |
| L3 | `/modul/admin` → **Status 404** und Konsolenfehler („Failed to load resource … 404“); die Seite selbst erscheint (aus `404.html`). Ursache: Umschreibregel `/modul/admin → /index.html` greift mit `cleanUrls` nicht | niedrig | **im Code behoben** (dieser PR) |
| L4 | `Strict-Transport-Security` aus `vercel.json` (`max-age=31536000`) ersetzt die strengere Vercel-Vorgabe (`max-age=63072000; includeSubDomains; preload`, sichtbar an Antworten ohne eigene Header, z. B. 308) | niedrig | **im Code behoben** (Umgesetzt, Empfehlung) |
| L5 | Unbekannte Pfade → `404.html` mit Status 404; die App zeigt die (deutsche) Startseite und stellt die Adresse auf `/` um – ohne Hinweis „Adresse nicht gefunden“. Entspricht docs/betrieb-vercel.md und dem Serverbetrieb | Hinweis | Frage mit Vorschlag (unten) |
| L6 | Abgeschaltete Seiten (`/modul/lernpfade`, `lv_*`) zeigen auf Vercel die Startseite (404), im Serverbetrieb die Hinweisseite „Lernpfade derzeit nicht verfügbar“ | Hinweis | gemeldet (wie dokumentiert) |
| L7 | KaTeX-Warnung „No character metrics for ‘‰’“ einmal in `mechanische_kenngroessen` (= B10 vom 02.11.) | niedrig | beobachten |

Erledigt gegenüber dem 02.11.: B1 (`.html`-Pfade), B2 (`/modul/<id>` ohne Endung), B3 (eigene 404 statt Vercel-Standard), B4 (Sicherheits-Header), B5 (`/server.cjs`), B6 (Zwischenspeicherung `/assets/*`), B7 (keine `/api`-Aufrufe), B9 (`noindex` auf `*.vercel.app`). B8 (Domain baustoffboard.de in Sitemap/robots/canonical) unverändert und beabsichtigt.

## 1. Deploy-Stand

| Merkmal | vor 23:11 UTC | ab 23:11 UTC | `origin/main` (d53de8e0) |
|---|---|---|---|
| Versionszeile im HTML | v4.4.0 (02.11.2026) | v4.4.0 (03.11.2026) | v4.4.0, Stand = Build-Datum (Europe/Berlin) |
| CSP-Hash Startschale | `sha256-fb+D…` (Stand 172cce85 aus #294) | `sha256-/CPy…` | `sha256-/CPy…` (`vercel.json`) |
| `data-nur-hell` (Startschale dunkel, #310) | fehlt | vorhanden | vorhanden |
| GitHub-Status „Vercel – babo“ | #310, #312: *failure – Deployment rate limited* | d53de8e0: *success* 23:11:54 | – |

Zuordnung: Der Wechsel auf babo-zeta fiel sekundengenau mit dem Erfolg von „Vercel – babo“ zusammen; `babo-i1nu.vercel.app` hatte main schon um 23:09, `babo-9xka.vercel.app` noch den alten Stand. Alle Prüfungen unten beziehen sich auf den Stand d53de8e0.

## 2. Erwartungen aus #294/#310/#313

| Prüfung | Ergebnis live | erwartet |
|---|---|---|
| `/server.cjs` | 404 | ✓ |
| `/modul/glas` | 200, vorgerenderte Seite (81,8 kB HTML), Modul sichtbar | ✓ |
| `/modul/glas.html` | 308 → `/modul/glas` | ✓ |
| Alias `/modul/lca`, `/modul/vorlesungen` | 308 → `/modul/oekobilanz_lca` bzw. `/modul/vl_bauen_im_bestand` | ✓ |
| `/modul/Glas` | 404, App stellt auf `/modul/glas` um, Modul sichtbar | ✓ (wie dokumentiert) |
| `/modul/gibtsnicht`, `/gibtsnicht` | 404 mit eigener Seite (`404.html` = App, `lang="de"`), Startseite | ✓ (L5) |
| `/modul/lernpfade` | 404, Startseite | L6 |
| `/modul/admin` | **404**, Admin-Hinweis sichtbar, 1 Konsolenfehler | L3, behoben |
| `/api/analytics/visit` | 404 (Klartext) | ✓ |
| `/modul/routen.json`, `/audit-bundle.json`, `/sitemap.xml`, `/robots.txt` | 200 | unkritisch |
| `/.env`, `/package.json`, `/src/App.tsx` | 404 | ✓ |
| `/#glas` (alte QR-Codes) | 200, Adresse wird `/modul/glas` | ✓ |

Header (Startseite, Modulseite, Asset, JSON):

| Header | live | Bewertung |
|---|---|---|
| `Content-Security-Policy` | erzwungen, identisch mit `vercel.json` (2 Hashes, ohne `unsafe-inline`/`unsafe-eval` in `script-src`) | ✓ |
| `X-Content-Type-Options` | `nosniff` | ✓ |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | ✓ |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), payment=()` | ✓ |
| `Strict-Transport-Security` | `max-age=31536000` (eigener Wert); ohne eigenen Wert setzt Vercel `max-age=63072000; includeSubDomains; preload` | L4, behoben |
| `Cache-Control` `/assets/*` | `public, max-age=31536000, immutable` | ✓ |
| `Cache-Control` `/fonts/*` | `public, max-age=604800` | ✓ |
| `Cache-Control` HTML, `suchindex.json`, `favicon.svg` | `public, max-age=0, must-revalidate` | ✓ (Vercel-Standard) |
| `X-Robots-Tag` | `noindex` auf allen Antworten unter babo-zeta.vercel.app | ✓ |

Browserprüfung (Desktop 1280 × 900, `networkidle` + 1,2 s):

| Seite | Status | Konsolenfehler | `/api`-Aufrufe | CSP-Verstöße | fehlgeschl. Abrufe | KaTeX-Fehler |
|---|---|---:|---:|---:|---:|---:|
| `/` | 200 | 0 | 0 | 0 | 0 | 0 |
| `glas`, `mischungsberechnung`, `oekobilanz_lca`, `statistik`, `spannbeton_grundlagen` | 200 | 0 | 0 | 0 | 0 | 0 |
| Quiz `aufgaben_quiz` | 200 | 0 | 0 | 0 | 0 | 0 |
| Vorlesungsbereich `vl_baustoffkunde`, `vl_bauen_im_bestand` | 200 | 0 | 0 | 0 | 0 | 0 |
| `admin` | **404** | **1** (Status 404 des Dokuments) | 0 | 0 | 0 | 0 |

### L3 – Ursache und Behebung

`vercel.json` enthielt `"rewrites": [{ "source": "/modul/admin", "destination": "/index.html" }]`. Mit `cleanUrls: true` liefert Vercel `/index.html` nicht als Ziel einer Umschreibung aus; die Anfrage fiel auf `404.html` durch. Inhaltlich war das dieselbe App, deshalb erschien der Admin-Hinweis – aber mit Status 404 und einer Konsolenmeldung des Browsers.

Behebung: Der Build legt `dist/modul/admin.html` als Kopie von `index.html` an (`buildCommand`: `… && cp dist/index.html dist/modul/admin.html && cp dist/index.html dist/404.html`); `cleanUrls` liefert die Datei wie jede vorgerenderte Modulseite mit 200 aus. Die Umschreibregel entfällt. `tests/statikModus.test.ts` prüft die Kopie und verbietet Umschreibungen auf `*.html`. Lokal mit `scripts/qa/vercel-vorschau.mjs` geprüft: `/modul/admin` 200, Admin-Hinweis sichtbar, 0 Konsolenfehler, 0 CSP-Verstöße. Live wirksam nach dem nächsten Deploy.

### L4 – HSTS

Der eigene Header in `vercel.json` überschreibt die Vorgabe von Vercel und schwächt sie ab (1 statt 2 Jahre, ohne `includeSubDomains`/`preload` unter `*.vercel.app`). Umgesetzt (Empfehlung): eigener Eintrag entfernt, Vercel setzt den Header je Domain selbst; `tests/statikModus.test.ts` prüft, dass kein eigener Wert zurückkommt. `server.ts` (Serverbetrieb) bleibt unverändert. Rückweg: Eintrag wieder anfügen (ein Commit).

## 3. Alle 288 Modulrouten über `/modul/<id>`

Liste: live `/modul/routen.json` (288 IDs, 52 Aliase, 9 inaktive). Je Route frischer Browserkontext, je 2 parallel, 0,4 s Pause.

| Prüfung | Ergebnis |
|---|---|
| HTTP-Status | 288 × 200, keine Weiterleitung |
| Endadresse | 288 × `/modul/<id>` (kein Rückfall auf die Startseite) |
| Überschrift | 288 × Modulüberschrift vorhanden |
| Konsolenfehler | 0 |
| Seitenfehler (`pageerror`) | 0 |
| CSP-Verstöße (`securitypolicyviolation`) | 0 |
| `/api`-Aufrufe | 0 |
| fehlgeschlagene bzw. ≥ 400 beantwortete Abrufe (Assets, Schriften, Daten) | 0 |
| `.katex-error` | 0 |
| kaputte Bilder | 0 |
| Konsolenwarnungen | 1: KaTeX „No character metrics for ‘‰’“ in `mechanische_kenngroessen` (L7) |

## 4. Ladezeit live

`scripts/qa/perf-messung.mjs --basis https://babo-zeta.vercel.app/ --ohne-datei --routen start,glas,mischungsberechnung,oekobilanz_lca` – Mobil 390 × 844, „Fast 3G“, CPU 4×, Cache aus, 3 Läufe, Median. Ziel LCP < 2,5 s.

| Seite | hell LCP | dunkel LCP (`--dunkel`) | Standardbreite LCP (`--breite standard`) | 02.11. live LCP (ohne vorgerenderte Seite) |
|---|---:|---:|---:|---:|
| start | 2,44 s ✓ | 2,51 s ✗ (Wiederholung mit 5 Läufen: 2,46 s ✓) | 2,43 s ✓ | 2,40 s |
| glas | 2,33 s ✓ | 2,42 s ✓ | 2,24 s ✓ | 3,90 s |
| mischungsberechnung | 2,31 s ✓ | 2,26 s ✓ | 2,47 s ✓ | 4,08 s |
| oekobilanz_lca | 2,26 s ✓ | 2,28 s ✓ | 2,31 s ✓ | 4,19 s |

Weitere Werte (hell / dunkel / Standardbreite):

| Seite | FCP | CLS | TBT ≈ (Ziel < 200 ms) | Klick | Übertragen |
|---|---|---|---|---|---:|
| start | 2,44 / 2,49 / 2,43 s | 0,000 | 82 / 125 / 123 ms ✓ | 48 / 64 / 56 ms | 368 kB |
| glas | 2,22 / 2,42 / 2,24 s | 0,000 | 161 / 116 / 286 ms | 32 / 40 / 48 ms | 612 kB |
| mischungsberechnung | 2,31 / 2,26 / 2,47 s | 0,000 | 247 / 492 / 586 ms ✗ | 56 / 40 / 56 ms | 609 kB |
| oekobilanz_lca | 2,26 / 2,28 / 2,31 s | 0,000 | 213 / 190 / 174 ms | 56 / 40 / 64 ms | 702 kB |

Bewertung: Die vorgerenderten Modulseiten wirken live – LCP der Module von 3,9–4,2 s auf 2,2–2,5 s, in allen drei Fassungen unter dem Ziel. Die Startseite liegt knapp darunter (2,43–2,51 s; LCP = FCP, also durch Netzlaufzeit und HTML-/CSS-Abruf begrenzt, nicht durch Skript). Die Startseite überträgt jetzt 368 kB (02.11.: 519 kB). TBT der Mischungsberechnung streut wie in AP 5.5 beschrieben stark (247–586 ms) und liegt über dem Ziel – bekannter Punkt, kein Live-Befund.

## 5. Sicherheit: Geheimnisse in Bundles

Durchsucht: live `index.html` und alle 477 Dateien aus Einstieg und Vorlade-Karte (`/assets/*.js|css`, `/boot/*.js`; alle 200) auf Schlüsselmuster (Google-API, OpenAI/Anthropic, GitHub, AWS, Slack, Stripe, Vercel-Token, private Schlüssel, JWT), auf Zuweisungen `password/secret/token/api_key = "…"` und auf Namen von Server-Umgebungsvariablen.

| Muster | Treffer | Bewertung |
|---|---:|---|
| `sk-…` | 9 (`sk-i…`, 23–26 Zeichen) | Fehlalarm: Klassennamen `mask-image-…` aus tailwind-merge |
| `api_key="…"` | 2 (`api_…`, 19 Zeichen) | Lehrbeispiel im Modul KI, lokaler LM-Studio-Platzhalter für `localhost` |
| `Token: …` | 1 | Preistext („Ausgabe-Token“) |
| `GEMINI_API_KEY`, `ADMIN_PASSWORD`, `VITE_*` | 0 | seit #294 kein Server-Bundle mehr öffentlich |
| alle übrigen | 0 | – |

Kein Geheimnis gefunden.

## Umgesetzt (Empfehlung)

1. **L3:** `/modul/admin` als Datei statt Umschreibung (`vercel.json`, `tests/statikModus.test.ts`, docs/betrieb-vercel.md, Kopfkommentar `scripts/qa/vercel-vorschau.mjs`).
2. **L4:** eigenes `Strict-Transport-Security` aus `vercel.json` entfernt (Vercel-Vorgabe strenger); Test und Doku angepasst.

## Fragen mit Vorschlag

1. **L2 (Vercel, nur Prof. Huber):** Für dasselbe Repository sind drei Vercel-Projekte verbunden (`babo` = babo-zeta.vercel.app, `babo-9xka`, `babo-i1nu`). Jeder Push – auch auf Arbeitszweige – erzeugt drei Builds; am 02.11. war das Tageskontingent erschöpft, #310 und #312 kamen deshalb erst mit #313 live. Vorschlag: in Vercel die Projekte `babo-9xka` und `babo-i1nu` löschen oder unter *Settings → Git* trennen (Disconnect), falls sie nicht gebraucht werden. Optional im Projekt `babo` unter *Settings → Git → Ignored Build Step* nur `main` bauen lassen (spart Vorschau-Builds der vielen Arbeitszweige; Vorschau-Adressen je PR entfallen dann).
2. **L5:** Unbekannte Adressen zeigen kommentarlos die Startseite. Vorschlag: kurzer Hinweis „Diese Adresse gibt es nicht – Sie sind auf der Startseite“ in der App, wenn der Pfad weder `/` noch ein bekanntes Modul ist (gilt dann auch im Serverbetrieb). Nicht umgesetzt, weil es die Oberfläche aller 404-Fälle ändert.

## Nach dem nächsten Deploy prüfen

- `https://babo-zeta.vercel.app/modul/admin` → 200, Konsole ohne Fehler.
- `curl -sI https://babo-zeta.vercel.app/ | grep -i strict-transport` → `max-age=63072000; includeSubDomains; preload`.
