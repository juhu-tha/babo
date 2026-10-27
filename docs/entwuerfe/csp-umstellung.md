# CSP scharf schalten – Ablauf nach dem Umzug auf Cloud Run (Entwurf, 27.10.2026)

Anlass: Gutachten 27.10.2026, Maßnahme 6 („CSP scharf schalten, nach Auswertung Report-Only im Betrieb“). **In diesem Schritt wird nichts umgeschaltet**; `server.ts` (Funktion `securityHeaders`) bleibt unverändert.

## Ist-Stand (`server.ts`, nur bei `NODE_ENV=production`)

| Header | Inhalt | Wirkung |
|---|---|---|
| `Content-Security-Policy` | `object-src 'none'; base-uri 'self'; form-action 'self'` | erzwungen (risikoarm, AP 1.9) |
| `Content-Security-Policy-Report-Only` | `default-src 'self'`; `script-src 'self'` + SHA-256 der Inline-Skripte aus `dist/index.html` + Google-Translate-Domains; `style-src 'self' 'unsafe-inline'` + Translate/gstatic; `img-src 'self' data: blob: https:`; `font-src 'self' data:`; `connect-src 'self'` + Translate; `frame-src 'self'` + YouTube; `frame-ancestors` (baustoffboard.de, AI Studio); `object-src`, `base-uri` | nur Meldung in der Browser-Konsole |

Es gibt **keinen Meldeendpunkt** (`report-to`/`report-uri`): Verstöße sind nur in der Konsole des jeweiligen Browsers sichtbar. Die Auswertung muss deshalb aktiv erfolgen (Schritt 2).

## 1. Voraussetzungen nach dem Umzug (Weg B, docs/betrieb-cloud-run.md)

- Dienst läuft unter der endgültigen Adresse (baustoffboard.de über Load Balancer) mit `NODE_ENV=production`.
- Prüfen, dass der Load Balancer bzw. Cloud Run keine eigenen CSP-Header setzt oder überschreibt (`curl -sI https://baustoffboard.de/ | grep -i content-security`).
- Prüfen, ob die Einbettung per Rahmenweiterleitung (baustoffboard.de → Cloud-Run-Adresse) entfällt. Wenn ja, kann `frame-ancestors` auf `'self'` (plus AI Studio, solange benötigt) verkürzt werden.

## 2. Auswertung im Report-Only-Betrieb (mindestens 2 Wochen, inkl. Vorlesungsbetrieb)

1. **Automatisierter Rundgang:** Playwright gegen die Produktionsadresse über alle Routen `/modul/<id>` (Liste wie `scripts/qa/a11y.mjs`), je Route Konsole mitschneiden und Meldungen mit `[Report Only]` bzw. „Content Security Policy“ sammeln; zusätzlich je Modul alle Reiter (`[role=tab]`) einmal anklicken. Getrennt prüfen:
   - vorgerenderte Seiten (`dist/modul/<id>.html`): enthalten sie Inline-Skripte, deren SHA-256 **nicht** in `dist/index.html` vorkommt? Der Hash wird nur aus `dist/index.html` berechnet (`distSkriptHashes`). Ggf. `inlineSkriptHashes` auch auf die vorgerenderten Seiten anwenden.
   - Funktionen mit Fremdzugriffen: Google Translate (Sprachumschalter), YouTube-Einbettungen, KI-Assistent (`/api/gemini/…`, nur `connect-src 'self'` nötig), PDF-Export (`blob:`), Diagramm-Export (html-to-image, `data:`/`blob:`), Live-Abstimmung, Admin-Bereich.
2. **Handprüfung** in Chrome, Firefox und Safari (Konsole offen): Startseite, ein Rechner mit Diagramm, Formelseite (KaTeX-Schriften), Sprachumschaltung auf Englisch über Google Translate, Druck/PDF.
3. **Optional Meldeendpunkt** (erst nach Rücksprache DSB, da Meldungen die IP-Adresse und die aufgerufene URL enthalten): `Reporting-Endpoints: csp="/api/csp-bericht"` + `report-to csp` in der Report-Only-Richtlinie; Express-Route, die Meldungen ohne IP zählt (Direktive, blockierte Quelle) und nur im Arbeitsspeicher hält – analog zur Anfragebegrenzung. Dann Abschnitt in der Datenschutzerklärung ergänzen.
4. Jede gemeldete Quelle entscheiden: **erlauben** (in die Richtlinie aufnehmen, mit Begründung im Kommentar) oder **entfernen** (Code ändern). Inline-Event-Handler/`eval` sind nicht zu erlauben.

## 3. Umschalten

1. In `securityHeaders` den Header-Namen der vollständigen Richtlinie von `Content-Security-Policy-Report-Only` auf `Content-Security-Policy` ändern und den bisherigen kurzen erzwungenen Header entfernen (er ist in der vollständigen Richtlinie enthalten). Den Kommentar „Nach Prüfung der Browser-Konsole im Betrieb … umstellen“ entsprechend anpassen.
2. Für eine Übergangszeit (z. B. 1 Woche) die **nächst strengere** Fassung parallel als Report-Only senden (etwa ohne `https:` in `img-src`), um weitere Härtungen vorzubereiten.
3. Test: `npm run -s build`, `node dist/server.cjs` mit `NODE_ENV=production`, Rundgang aus Schritt 2.1 lokal – keine CSP-Fehler in der Konsole; `tests/` um einen Test ergänzen, der die Header von `securityHeaders` prüft (Name `Content-Security-Policy`, enthält `default-src 'self'`, kein `'unsafe-eval'`).
4. Bereitstellen, danach 48 Stunden Konsolen-Stichproben; Rückweg: Header-Namen zurück auf `…-Report-Only` (ein Commit, kein Datenverlust).

## 4. Offene Entscheidungen (Prof. Huber / Betrieb)

- Google Translate weiter anbieten? Es erzwingt die Translate-Domains in `script-src`, `style-src`, `connect-src` und `'unsafe-inline'` bei Styles. Ohne Translate ließe sich `style-src` deutlich enger fassen (Tailwind und KaTeX brauchen weiterhin `'unsafe-inline'` für `style`-Attribute – zu prüfen).
- Meldeendpunkt ja/nein (Datenschutz, siehe 2.3).
- `frame-ancestors` nach Wegfall der Rahmenweiterleitung verkürzen.
