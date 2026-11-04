# Freigabepaket: Tools für Thesen & Literatur (`ki_thesen`)

Stand 04.11.2026 · Gruppe „KI im Bauwesen“ · Typ `standard` · Prüfvermerk „offen“ (Prüfung ausstehend).

**Empfehlung: freigabereif nach Klärung von T14-TH-5** – Vier Fehler behoben, Formular entpersonalisiert; offen ist nur die Wiedergabe des Normverfahrens für den Sekantenmodul in einem Übungsszenario.

Dieses Paket bereitet die Freigabe vor. Es setzt keinen Prüfvermerk; die Freigabe trägt die prüfende Person in `src/data/pruefvermerke.ts` ein.

## Zweck

KI-Werkzeuge für Abschlussarbeiten im Master „KI im Bauwesen“: Literaturrecherche (Elicit, Connected Papers, scite), quellentreue Synthese (NotebookLM), Literaturverwaltung (Zotero, Better BibTeX), Prompt-Labor mit Bau-Szenarien, Deklarationsmatrix und Ehrenerklärung.

Bedeutung für die Lehre: Lehrveranstaltung (Vertiefung, Wahlpflicht, Master, Weiterbildung); Lernpfade: KI im Bauwesen (Master).

## Reiter und Bereiche

Reiter „Tools für Thesen“ der Komponente KiBaustoffe: Werkzeugkatalog, Literatur-Workflow, Prompt-Labor (vier Szenarien), Deklarationsmatrix, Ehrenerklärung.

Komponente `src/modules/KiBaustoffe.tsx`; Inhalt `content/ki/FehlerRechtEthik.json`, `content/ki/KiDeklarationGuide.json`, `content/ki/KiGlossar.json`, `content/ki/KiOnlinekurse.json`, `content/ki/KiUeberblick.json`, `content/ki/LlmPraxis.json`, `content/ki/LlmPraxisTeile/BrowserTab.json`, `content/ki/LlmPraxisTeile/MarkdownTab.json`, `content/ki/LlmPraxisTeile/SkillsKonnektorenTab.json`, `content/ki/LlmPraxisTeile/VerzeichnisseTab.json`, `content/ki/LokaleKI.json`, `content/ki/ModelBenchmarkMatrix.json`, `content/ki/RagDemonstrator.json`, `content/ki/Systemarchitektur.json`, `content/ki/ToolsFuerThesen.json`, `content/ki/ueberblick/AusblickTab.json`, `content/ki/ueberblick/HistorieTab.json`, `content/ki/ueberblick/KernbegriffeTab.json`, `content/ki/ueberblick/PipelineTab.json`, `content/ki/ueberblick/StandTab.json`, `content/ki/ueberblick/VergleichTab.json`, `content/ki/ueberblick/daten.json`, `content/kibaustoffe/KiBaustoffe.json`.

## Rechenkerne und Testabdeckung

Kein Rechenkern; Precision/Recall und R² in Tranche 14 nachgerechnet.

## Bisherige Befunde

| Kennung | Befund | Status | Fundstelle |
|---|---|---|---|
| T14-TH-1 | „f_ck = f_cm − 1,64·s nach DIN EN 206“ → Konformität f_cm ≥ f_ck + 1,48·σ | erledigt (behoben) | T14 (`module-tranche-14.md`) (Nr. 4) |
| T14-TH-2 | Python-Musterlösung mit `\v`/`\t` in normalen Zeichenketten → Rohstrings | erledigt (behoben) | T14 (`module-tranche-14.md`) |
| T14-TH-3 | DIN 1338 (Formelsatz) und DIN EN 12390-16 (Schwinden) richtig zugeordnet | erledigt (behoben) | T14 (`module-tranche-14.md`) |
| T14-TH-4 | Hochschulnamen und „0 Punkte“ → Prüfungsordnung maßgeblich; Anbieterangaben mit Stand | erledigt (behoben) | T14 (`module-tranche-14.md`) |
| Hinweis | Deklarationsformular mit Prüfernamen vorbelegt → „[Name]“ | erledigt (umgesetzt) (29.10.) | T14 (`module-tranche-14.md`) |
| T14-TH-5 | Sekantenmodul aus der Bruchkurve zwischen 0,05·f_cm und 0,33·f_cm; die Norm misst mit Be- und Entlastungszyklen zwischen etwa 0,10–0,15·f_c und f_c/3 | offen (Normtext) (als „vereinfacht“ gekennzeichnet) | T14 (`module-tranche-14.md`) |

## Offene Normpunkte

Diese Punkte sind im Modul als „vorläufig, Normprüfung ausstehend“ gekennzeichnet und lassen sich nur am Normtext klären. Kennungen nach dem Prüfbogen Normtext (Stand 28.10.2026) bzw. nach der Befundliste; Zeilenangaben in „Wert in der App“ vom Stand des Prüfbogens.

| Kennung | Norm, Fundstelle | Zu prüfen | Wert in der App |
|---|---|---|---|
| T14-TH-5 | DIN EN 12390-13:2021-09 (Abschnitt Verfahren B prüfen) | Spannungsgrenzen und Zyklen des Sekantenmoduls | Prompt-Labor-Szenario „Prüfmaschinen-CSV“ in `content/ki/ToolsFuerThesen.json` |

## Quizfragen

6 Fragen, alle freigegeben.

## Quellen

DIN EN 206, DIN EN 12390-9/-13/-16, DIN 1338; Anbieterseiten der Werkzeuge (Stand 10/2026). Befundliste Tranche 14, Nr. 4.

## Prüfschritte für die Freigabe (ca. 15 min)

1. Precision/Recall: 40 Treffer, davon 22 relevant, 30 relevante bekannt → P = 0,55, R = 0,733.
2. Bestimmtheitsmaß: SS_res = 12, SS_tot = 150 → R² = 0,92.
3. Konformität im Prompt-Labor: f_cm ≥ f_ck + 1,48·σ (stetige Herstellung), nicht „f_ck = f_cm − 1,64·s“.
4. Python-Musterlösung: Achsenbeschriftungen als Rohstrings (`r"…"`), damit `\varepsilon` und `\times` nicht als Steuerzeichen gelesen werden.
5. Sekantenmodul-Szenario: Kennzeichnung „vereinfacht in Anlehnung an DIN EN 12390-13“ und die Normgrenzen prüfen (T14-TH-5).

## Empfehlung

**freigabereif nach Klärung von T14-TH-5.** Vier Fehler behoben, Formular entpersonalisiert; offen ist nur die Wiedergabe des Normverfahrens für den Sekantenmodul in einem Übungsszenario.

Nach der Regel der Freigabe vom 02.11.2026 (Tranche 16: im Modul gekennzeichnete Normtextpunkte gelten als erledigt) wäre das Modul schon jetzt freigabereif; nach der Regel vom 28.10.2026 (Normtextpunkte blockieren) erst nach dem Normtextabgleich. Siehe `README.md`, Abschnitt „Zu entscheiden“.
