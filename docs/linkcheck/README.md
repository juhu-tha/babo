# Linkprüfung (Zwischenreview 10/2026, Paket Z16)

Monatliche, automatische Prüfung aller externen Links in `src/` und `content/` (sobald vorhanden). Der Lauf bricht nicht ab, sondern schreibt einen Bericht: welche Links nicht mehr erreichbar sind, welche dauerhaft umgezogen sind (mit Vorschlag für die neue URL) und welche sich automatisch nicht prüfen lassen. Ob ein erreichbarer Link inhaltlich noch passt, prüft der Lauf nicht.

## Ablauf

| Schritt | Was passiert |
|---|---|
| Auslöser | `.github/workflows/link-check.yml`: am 3. jedes Monats (04:41 UTC) sowie manuell (`workflow_dispatch`) |
| Skript | `node scripts/qa/link-check.mjs` (nur Node-Bordmittel, keine Zusatzpakete) |
| Ergebnis | `docs/linkcheck/<JJJJ-MM>.md` (Bericht) und `docs/linkcheck/<JJJJ-MM>.json` (maschinenlesbar, je Link eine Zeile). Beide im Workflow als Artefakt; eingecheckt wird nur der Markdown-Bericht (JSON steht in `.gitignore`) |
| Issue | bei jedem Lauf: „Linkprüfung <JJJJ-MM>“ mit dem Bericht (auf 60 000 Zeichen gekürzt); ein zweiter Lauf im selben Monat kommentiert das offene Issue |
| PR | nur wenn sichere Ersetzungen möglich sind (siehe unten): Branch `link-check/<Datum>` mit den geänderten Dateien und dem Bericht |

## Klassen

| Klasse | Bedeutung | im Bericht |
|---|---|---|
| ok | Antwort 2xx ohne Weiterleitung | nur gezählt |
| Weiterleitung | 3xx-Kette mit erreichbarem Ziel. **Dauerhaft** (301/308 bzw. Wikipedia-Weiterleitung): neue URL wird vorgeschlagen. Vorübergehend (302/303/307): kein Handlungsbedarf | Abschnitt 2 (dauerhaft), sonst nur gezählt |
| nicht erreichbar | 4xx (außer 401/403/429), 5xx nach einem Wiederholungsversuch, DNS-, Verbindungs- oder Zertifikatsfehler, Weiterleitungsschleife; Wikipedia-Artikel, die nicht existieren | Abschnitt 1 |
| manuell prüfen | durch robots.txt ausgeschlossen, robots.txt nicht abrufbar, 401/403/429 oder erkennbarer Bot-Schutz (`cf-mitigated`, 503 von Cloudflare/Akamai …) | Abschnitt 3 (Checkliste) |

Zusätzlich (Abschnitt 4): YouTube-Suchergebnis-Links, Suchmaschinen-Links, unverschlüsselte `http`-Adressen und Wikipedia-Begriffsklärungsseiten. Jede Zeile nennt die Fundstellen als `Datei:Zeile`.

### Sichere Ersetzung (PR)

Automatisch ersetzt wird eine URL nur, wenn **alle** Bedingungen erfüllt sind:

- die ganze Kette besteht aus dauerhaften Weiterleitungen (301/308) und endet mit 2xx, bzw. Wikipedia meldet eine Weiterleitung auf einen Artikel (nicht auf einen Abschnitt, keine Begriffsklärung);
- Ziel liegt auf derselben Website (Host gleich, `www.` egal) und nicht von `https` auf `http`;
- Ziel ist keine Start- oder Anmeldeseite (sonst ist die Seite vermutlich entfernt), und ein Link auf die Startseite bleibt ein Link auf die Startseite (nur Protokoll/`www.` dürfen sich ändern);
- Ziel enthält keine Sitzungs- oder Tracking-Parameter.

Ersetzt wird nur an den Fundstellen, die die Extraktion gefunden hat (keine Textsuche), damit z. B. `…/x` nicht in `…/x.html` geändert wird. Weiterleitungen auf andere Domains stehen nur im Bericht.

## Regeln für den Abruf

- **robots.txt** jedes Hosts wird vor dem ersten Abruf gelesen und befolgt (eigene Gruppe `babo-link-check`, sonst `*`; Allow/Disallow mit Platzhaltern, `Crawl-delay`). Ist robots.txt nicht abrufbar (Netzfehler, 5xx), wird der Host **nicht** abgefragt (→ manuell prüfen); 4xx gilt nach RFC 9309 als „keine Einschränkung“. Crawl-delay über 60 s → manuell prüfen. Bei Weiterleitungen auf einen anderen Host gilt dessen robots.txt.
- **Text- und Data-Mining**: Es findet keines statt. Geprüft wird mit `HEAD`; nur wenn der Server darauf mit einem Fehler antwortet, folgt ein `GET`, dessen Antwortkörper ungelesen verworfen wird. Gespeichert werden nur Status, Weiterleitungsziel und einige Kopfzeilen. Ein `tdm-reservation`-Header (TDM Reservation Protocol) wird im Bericht protokolliert.
- **User-Agent**: `babo-link-check/1.0 (+https://github.com/juhu-tha/babo; Lehrplattform BaustoffBoard, monatliche Linkpruefung)`.
- **Rate-Limit**: höchstens ein Abruf je Host alle 2 s (`--verzoegerung`, mindestens 1000 ms) bzw. laut Crawl-delay; höchstens 6 Hosts gleichzeitig (`--parallel`); Zeitlimit 20 s je Abruf; ein Wiederholungsversuch bei 5xx/Zeitüberschreitung.
- **Wikipedia** (rund 450 Artikel): über die MediaWiki-Action-API (`/w/api.php?action=query&redirects=1&prop=pageprops`), 50 Titel je Anfrage, nacheinander, mit `maxlag=5`, eigenem User-Agent und `Retry-After`-Beachtung – rund zehn Anfragen statt 450 Seitenabrufen. Die Wikipedia-robots.txt schließt `/w/` für Crawler aus; die API ist aber die von Wikimedia für automatisierte Abfragen vorgesehene Schnittstelle (API-Etikette und User-Agent-Richtlinie der Wikimedia Foundation) und belastet die Server deutlich weniger. Mit `--ohne-wikipedia-api` werden die Artikelseiten (`/wiki/…`, laut robots.txt erlaubt) stattdessen einzeln geprüft; Artikel ohne API-Antwort laufen automatisch über diesen Weg.
- **Cache** `.cache/link-check/ergebnisse.json` (7 Tage, im Workflow über `actions/cache`; nicht eingecheckt): nur stabile Befunde (ok, Weiterleitung, 4xx), keine Inhalte. Gesperrte Abrufe und Netzfehler werden jedes Mal neu geprüft.
- Nicht geprüft werden lokale Adressen, `example.com`, XML-Namensräume (`http://www.w3.org/2000/svg`), URLs in Template-Strings (`…/${x}`) und Zeilen mit dem Kommentar `linkcheck-ignore`.

## Lokal ausführen

```bash
node scripts/qa/link-check.mjs                      # alles, Bericht nach docs/linkcheck/
node scripts/qa/link-check.mjs --nur-host beton.wiki --cache-tage 0
node scripts/qa/link-check.mjs --max 50 --out /tmp/linkcheck
node scripts/qa/link-check.mjs --ersetzen           # sichere Ersetzungen direkt in src/ bzw. content/ schreiben
```

Weitere Optionen: `--datum JJJJ-MM`, `--verzoegerung 2000`, `--parallel 6`, `--cache .cache/link-check`, `--ohne-wikipedia-api`, `--issue-body datei.md`, `--pr-body datei.md`. Exit-Code 2, wenn keine einzige Quelle antwortete (der Workflow legt trotzdem ein Issue an). Ein vollständiger Lauf dauert einige Minuten.

Tests ohne Netz: `npx tsx tests/linkCheck.test.ts` (Fixtures in `tests/fixtures/link-check/`).

## Erster Lauf im Workflow

Zeitgesteuerte Workflows und `workflow_dispatch` stehen erst zur Verfügung, wenn `link-check.yml` auf `main` liegt. Danach einmal manuell starten: Actions → „Link-Check“ → „Run workflow“. Damit der PR für sichere Ersetzungen angelegt werden kann, muss in den Repository-Einstellungen „Allow GitHub Actions to create and approve pull requests“ aktiv sein; sonst bleibt der Branch stehen und das Issue weist darauf hin.
