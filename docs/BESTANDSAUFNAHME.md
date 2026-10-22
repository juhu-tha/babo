# Bestandsaufnahme BaustoffBoard (Stand 18.10.2026)

Grundlage: Repository `juhu-tha/babo`, Commit `8d8f29a` (Übertragung aus Google AI Studio am 18.10.2026, 18:42 Uhr). Version laut `package.json`: 3.18.0.

## 1. Umfang und Struktur

| Bereich | Inhalt |
|---|---|
| `src/` | 342 Dateien, ca. 225 700 Zeilen TypeScript/TSX, 15 MB |
| `src/modules/` | 225 Fachmodule (größte: Nachhaltigkeit 234 KB, Abfälle 202 KB, SpannbetonKennwerte 194 KB, ModuleInfo 183 KB, Beispielrechnungen 181 KB) |
| `src/App.tsx` | 134 KB; zentrale Navigation mit 177 nachgeladenen Modulen und 265 Abfragen `activeTab === '…'` (243 verschiedene IDs) |
| `src/data/` | u. a. `centralNormenRegistry.ts` (656 Zeilen, nur in 3 Dateien genutzt), `bibliography.ts` (223 Zeilen, in 1 Datei genutzt), Abstimmungsfragen, Glossar |
| Hauptordner | 52 einmalige Hilfsskripte und Zwischendateien (`fix_*.cjs`, `update_*.ts`, `temp*.txt` …); vom Build nicht verwendet |
| `server.ts` | Express-Server (230 Zeilen): Gemini-Proxy, Besuchszähler, Live-Abstimmung, Auslieferung |
| `GEMINI.md` | Styleguide und Modulspezifikation für den KI-Assistenten in AI Studio (Referenzmodul: `Kalk.tsx`) |

Tote Module (in `App.tsx` deklariert, nie angezeigt): SpannungDehnung, Hydratation, IntegrationVerformungen, Rissbreite, ZfP, Recyclingbeton, Praxisbeispiele, Leichtbeton, Spritzbeton.

## 2. Technik

React 19, TypeScript 5.8, Vite 6, Tailwind CSS 4, KaTeX/react-katex, Recharts und Chart.js (zwei Diagrammbibliotheken), three.js mit @react-three/fiber, motion, jsPDF, html-to-image, xlsx, qrcode, @google/genai (nur im Server). Paketverwaltung in AI Studio über **bun** (`bun.lock` aktuell). `package-lock.json` ist veraltet (5 Pakete fehlen) – `npm ci` und damit das `Dockerfile` schlagen fehl.

## 3. Prüfergebnisse

| Prüfung | Ergebnis |
|---|---|
| `npm run build` | erfolgreich (30 s); Hauptbundle 1 099 KB (355 KB gzip), Chunks > 500 KB: shapes 938, Aufgaben 743, Ökobilanz 729, KiBaustoffe 616, Spannbeton 522 KB |
| `tsc --noEmit` | 4 Fehler: `Spannbeton.tsx` (Eigenschaft `permCompStress` existiert nicht), `SpannbetonKennwerte.tsx` (3× falscher Typ `CementClass`/`phi_0`) – mögliche Rechenfehler, wird im Spannbeton-PR behoben |
| `npm audit` (Produktion) | 20 Meldungen: 2 kritisch (protobufjs, proxy-addr), 8 hoch (u. a. vite, ws, path-to-regexp, postcss), 5 mittel, 5 niedrig; alle ohne Breaking Change behebbar. Zusätzlich: `xlsx` 0.18.5 aus npm wird nicht mehr gepflegt |
| Geheimnisse | keine API-Schlüssel, Tokens oder privaten Schlüssel im Repository; `.env.example` nur mit Platzhaltern |

## 4. Server und Sicherheit

1. **Admin-Kennwort im Frontend** (`src/modules/Admin.tsx`), Freischaltung nur über `sessionStorage`.
2. **Abstimmungs-Kennwort „admin“** fest im Server und im Frontend; wird in der Oberfläche sogar als Hinweis angezeigt.
3. **`/api/polls/:id/simulate`** ohne Schutz: jeder kann bis zu 50 Stimmen je Aufruf erzeugen. Stimmen werden ohne Mehrfachschutz angenommen.
4. **`/api/gemini/analyze`** ohne Begrenzung: Jeder kann über die App beliebige Anfragen an Gemini auf Ihre Kosten stellen.
5. **`vite.config.ts`** schreibt `GEMINI_API_KEY` beim Build in das Frontend (`define`), sobald er in der Build-Umgebung gesetzt ist. Im Frontend wird er nicht verwendet – Eintrag ist ein Risiko ohne Nutzen.
6. Keine Kompression, kein Cache für Assets, keine Sicherheits-Header, `X-Powered-By: Express`, jede Adresse liefert Status 200.
7. Besuchszähler und Abstimmungen liegen im Container (Datei bzw. Arbeitsspeicher) und gehen bei jedem Neustart oder bei mehreren Instanzen verloren.

## 5. Reihenfolge der Arbeitspakete

| Nr. | Paket | Aufwand |
|---|---|---|
| 1 | Kennwörter entfernen, Server absichern (Kompression, Header, Cache, Begrenzungen) | S |
| 2 | Abhängigkeiten aktualisieren (`npm audit fix`), `package-lock.json` reparieren, Hilfsskripte aufräumen, tote Module entfernen | S |
| 3 | Ladezeit: Schriften woff2, PDF-Bibliotheken bei Bedarf laden, große Chunks teilen | M |
| 4 | Formel- und Laufzeitprüfung (KaTeX strict, Playwright-Durchlauf aller Module) | M |
| 5–8 | Fachliche Korrekturpakete: Rheologie, Spannbeton (inkl. TS-Fehler), Bauen im Bestand, Mängel & Schäden | je M |
| 9 | Prüfung der übrigen Modulgruppen | L |
| 10 | Teil B: Modulregister, Inhalte als Daten, Pfad-Routing (nach Freigabe) | L |
