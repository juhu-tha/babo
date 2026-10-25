# Normen- und Rechtsstand-Check (AP 6.7)

Halbjährlicher, automatischer Abgleich der zitierten Regelwerke mit ihren aktuellen Ausgaben. Er ersetzt nicht die fachliche Bewertung: Der Check meldet, **dass** sich etwas geändert hat und **wo** es zitiert ist. Ob und wie Inhalte angepasst werden, entscheidet der Autor.

## Ablauf

| Schritt | Was passiert |
|---|---|
| Auslöser | `.github/workflows/normen-check.yml`: 1. März und 1. September (05:17 UTC) sowie manuell (`workflow_dispatch`) |
| Skript | `node scripts/qa/normen-check.mjs` (nur Node-Bordmittel, keine Zusatzpakete) |
| Ergebnis | `docs/normen-check/<JJJJ-MM>.md` (Bericht), `docs/normen-check/<JJJJ-MM>.json` (maschinenlesbar) und der Abschnitt „Normen- und Rechtsstand“ in `docs/quiz-pruefhinweise.md` |
| PR | Branch `normen-check/<Datum>`, PR gegen den Branch, auf dem der Lauf gestartet wurde (geplant: `main`) |
| Issue | wenn keine Quelle erreichbar war (Exit-Code 2), der PR nicht angelegt werden konnte oder der Lauf fehlschlug |

Der PR ändert nur die Berichte und die Prüfliste, keine Inhalte. Nach der fachlichen Bewertung werden Registry (`src/data/centralNormenRegistry.ts`), Modul-Fußzeilen und Texte nachgezogen; `npm run check:quellen` prüft dann wieder die Einheitlichkeit der Ausgaben (AP 0.5).

## Quellen

| Bereich | Quelle | automatisch? |
|---|---|---|
| DIN-, DIN-EN-, DIN-EN-ISO-Normen der Registry und Normzitate mit Ausgabe aus `docs/quiz-pruefhinweise.md` | DIN Media: Produktseiten `/de/norm/<nummer>/<id>`, gefunden über die von DIN Media veröffentlichte Sitemap (`service-sitemap-dinmedia-de-sitemap_index.xml`). Ausgewertet werden Titel, „Ausgabedatum“, „Ersatzvermerk“ (ersetzt durch …, teilweise ersetzt) und „Dokument zurückgezogen“; Ersatzketten werden bis zu drei Schritte verfolgt. | ja |
| Bundesgesetze und -verordnungen (`scripts/qa/normen-check-gesetze.json`) | gesetze-im-internet.de: Inhaltsübersicht bzw. Gesamtausgabe, Angabe „Stand: Zuletzt geändert durch …“ und „Hinweis: Änderung durch … textlich nachgewiesen“. Vergleich mit dem Stand des letzten Laufs (JSON). | ja |
| Bundesgesetzblatt | recht.bund.de: nur Suchlink im Bericht (Crawl-delay 30 s; Konsolidierung übernimmt gesetze-im-internet.de) | nein |
| EU-Rechtsakte (BauPVO, KI-VO, ESPR, EPBD, REACH, Taxonomie) | EUR-Lex: Link im Bericht | nein, manuell |
| Merkblätter, Richtlinien (DBV, DAfStb, WTA …) | Herausgeber | nein, manuell |
| bauaufsichtliche Einführung (MVV TB) | – | nein, manuell |

Normen, die nicht in der Sitemap stehen (z. B. Sammelangaben wie „DIN 18531“ ohne Teil), deren Seite nicht auswertbar ist oder die nur teilweise ersetzt wurden, erscheinen im Bericht unter „Manuell zu prüfen“ mit Suchlink.

## Regeln für den Abruf

- **robots.txt** jedes Hosts wird vor dem ersten Abruf gelesen und befolgt (eigene Gruppe `babo-normen-check`, sonst `*`; Allow/Disallow mit Platzhaltern, `Crawl-delay`). Ist robots.txt nicht abrufbar (Netzfehler, 5xx), wird der Host **nicht** abgefragt; die Punkte landen in der manuellen Prüfliste. 4xx gilt nach RFC 9309 als „keine Einschränkung“.
- DIN Media: Stand 25.10.2026 erlaubt robots.txt für `*` alles außer `/beuth/owa/`, `/*!suggest`, `/php/`, `/user-management/`. Die Suche (`/de/suche`) wird nicht abgefragt (clientseitig, serverseitig 404), sondern nur verlinkt.
- User-Agent: `babo-normen-check/1.0 (+https://github.com/juhu-tha/babo; …)`.
- Höchstens ein Abruf je Host alle 3 s (`--verzoegerung`), ein Wiederholungsversuch bei Netz-/Serverfehler.
- Cache `.cache/normen-check/` (7 Tage, im Workflow über `actions/cache`); nicht eingecheckt.
- Umfang je Lauf: 7 Sitemap-Dateien und rund 90 Produktseiten bei DIN Media, rund 35 Seiten bei gesetze-im-internet.de – zweimal im Jahr.

## Lokal ausführen

```
node scripts/qa/normen-check.mjs                      # alles, schreibt docs/normen-check/<JJJJ-MM>.*
node scripts/qa/normen-check.mjs --ohne-gii --max 5   # nur DIN Media, erste 5 Normen
node scripts/qa/normen-check.mjs --ohne-dinmedia      # nur Recht + manuelle Liste
```

Weitere Optionen: `--datum JJJJ-MM`, `--out`, `--pruefliste`, `--cache`, `--cache-tage`, `--pr-body <datei>`. Tests (offline, mit nachgebauten Seiten in `tests/fixtures/normen-check/`): `npx tsx tests/normenCheck.test.ts` (Teil von `npm test`).

## Pflege

- Neue Norm: in die Registry eintragen – der Check übernimmt sie automatisch.
- Neues Gesetz: Eintrag in `scripts/qa/normen-check-gesetze.json` (`kurz`, `gii` = Pfad bei gesetze-im-internet.de, `suchmuster` für Fundstellen in `src/`). Ein falscher Pfad erscheint als „nicht abrufbar“.
- Ändert DIN Media oder gesetze-im-internet.de den Seitenaufbau, melden die Berichte „Seite nicht auswertbar“; dann Parser (`parseDinMediaSeite`, `parseGiiSeite`) und Fixtures anpassen.

## Grenzen und offene Punkte

- Die Nutzungsbedingungen von DIN Media zu automatisierten Abrufen sind vom Autor zu bestätigen; bis dahin kann der Lauf mit `ohne_dinmedia` (Workflow-Eingabe) bzw. `--ohne-dinmedia` gestartet werden.
- Der Parser für gesetze-im-internet.de ist gegen nachgebaute Seiten getestet; aus der Entwicklungsumgebung war der Host nicht erreichbar. Der erste Lauf in GitHub Actions zeigt, ob alle Pfade in `normen-check-gesetze.json` stimmen (insbesondere GModG unter `geg`).
- Mit `GITHUB_TOKEN` angelegte PRs starten keine weiteren Workflows (QA läuft erst nach einem weiteren Push). In den Repository-Einstellungen muss „Allow GitHub Actions to create and approve pull requests“ aktiv sein, sonst legt der Workflow ein Issue mit dem Branchnamen an.
- `workflow_dispatch` ist erst möglich, wenn die Workflow-Datei auf dem Standardbranch liegt.
