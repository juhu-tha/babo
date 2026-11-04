# Freigabepaket: LLM-Praxis (Chat-KI-Assistenten) (`ki_llmpraxis`)

Stand 04.11.2026 · Gruppe „KI im Bauwesen“ · Typ `standard` · Prüfvermerk „offen“ (Prüfung ausstehend).

**Empfehlung: freigabereif** – Sechs Befunde behoben, Rechts- und Normaussagen der Stichprobe richtig; offen ist nur die Tabellenzeile der DIN 18202 in einer Mustervorlage. Die Normpunkte sind in der App gekennzeichnet und gelten nach der Regel vom 02.11.2026 als erledigt.

Dieses Paket bereitet die Freigabe vor. Es setzt keinen Prüfvermerk; die Freigabe trägt die prüfende Person in `src/data/pruefvermerke.ts` ein.

## Zweck

Praxis mit Chat-KI-Assistenten für den Master „KI im Bauwesen“: Assistententypen, Skills und MCP-Konnektoren, Markdown-Strukturierung, Projektverzeichnisse und Anweisungsdateien, Web-Grounding, Vorlagen-Generator mit Bau-Beispielen (Bedenkenanmeldung, Behinderungsanzeige).

Bedeutung für die Lehre: Lehrveranstaltung (Vertiefung, Wahlpflicht, Master, Weiterbildung); Lernpfade: KI im Bauwesen (Master).

## Reiter und Bereiche

Reiter „LLM-Praxis“ der Komponente KiBaustoffe mit Teilen Assistenten, Skills & Konnektoren, Markdown, Verzeichnisse, Browser/Web-Grounding, Vorlagen.

Komponente `src/modules/KiBaustoffe.tsx`; Inhalt `content/ki/FehlerRechtEthik.json`, `content/ki/KiDeklarationGuide.json`, `content/ki/KiGlossar.json`, `content/ki/KiOnlinekurse.json`, `content/ki/KiUeberblick.json`, `content/ki/LlmPraxis.json`, `content/ki/LlmPraxisTeile/BrowserTab.json`, `content/ki/LlmPraxisTeile/MarkdownTab.json`, `content/ki/LlmPraxisTeile/SkillsKonnektorenTab.json`, `content/ki/LlmPraxisTeile/VerzeichnisseTab.json`, `content/ki/LokaleKI.json`, `content/ki/ModelBenchmarkMatrix.json`, `content/ki/RagDemonstrator.json`, `content/ki/Systemarchitektur.json`, `content/ki/ToolsFuerThesen.json`, `content/ki/ueberblick/AusblickTab.json`, `content/ki/ueberblick/HistorieTab.json`, `content/ki/ueberblick/KernbegriffeTab.json`, `content/ki/ueberblick/PipelineTab.json`, `content/ki/ueberblick/StandTab.json`, `content/ki/ueberblick/VergleichTab.json`, `content/ki/ueberblick/daten.json`, `content/kibaustoffe/KiBaustoffe.json`.

## Rechenkerne und Testabdeckung

Kein Rechenkern; zwei Zahlenbeispiele (Fehlerquote, Mehrheitsentscheid) in Tranche 14 nachgerechnet.

## Bisherige Befunde

| Kennung | Befund | Status | Fundstelle |
|---|---|---|---|
| T14-LP-1 | Bedenkenanmeldung: „Textform nicht ausreichend“ → schriftlich nach § 4 Abs. 3 VOB/B, Zugang nachweisbar | erledigt (behoben) | T14 (`module-tranche-14.md`) (Nr. 3) |
| T14-LP-2 | DWD-Konnektor „rechtssicher bei Schlechtwetteranzeigen“ → Beleg für Behinderungsanzeigen, § 6 Abs. 2 Nr. 2 VOB/B | erledigt (behoben) | T14 (`module-tranche-14.md`) |
| T14-LP-3 | „Wassereinwirkungsklasse“ → „Wasserbeanspruchungsklasse“ (DIN 18533:2026-06) | erledigt (behoben) | T14 (`module-tranche-14.md`) |
| T14-LP-4 bis -6 | § 15 VOB/B (Stundenlohnarbeiten), überzogene Aussagen zu Halluzinationen abgeschwächt, Kontextauslastung als Faustwert | erledigt (behoben) | T14 (`module-tranche-14.md`) |
| T14-LP-7 | Vorlage: „Unebenheiten bis 22 mm auf 4 m (zulässig nach DIN 18202 Zeile 3: max. 10 mm)“ – für die Oberseite einer Bodenplatte unter Estrich eher Tab. 3 Zeile 2 (12 mm) | offen (Normtext) | T14 (`module-tranche-14.md`) |

## Offene Normpunkte

Diese Punkte sind im Modul als „vorläufig, Normprüfung ausstehend“ gekennzeichnet und lassen sich nur am Normtext klären. Für die Freigabe gelten sie als erledigt (Regel vom 02.11.2026, Entscheidung vom 04.11.2026); sie bleiben im Prüfbogen Normtext, Reiter „Nach Normen (04.11.)“, offen. Kennungen nach dem Prüfbogen bzw. nach der Befundliste; Zeilenangaben in „Wert in der App“ vom Stand des Prüfbogens (28.10.2026).

| Kennung | Norm, Fundstelle | Zu prüfen | Wert in der App |
|---|---|---|---|
| T14-LP-7 | DIN 18202:2019-07, Tab. 3 | Zeile 2 (12 mm bei 4 m, Oberseite Rohdecke/Unterboden) oder Zeile 3 (10 mm, flächenfertige Böden) für die Oberseite einer Bodenplatte unter Estrich? | Vorlage Bedenkenanmeldung in `content/ki/LlmPraxis.json:95` |

## Quizfragen

7 Fragen, davon 1 nicht freigegeben: `qlz_ki_llmpraxis_1`.

## Quellen

VOB/B 2016 (§§ 4, 6, 8, 15), BGB § 127, DIN 18533:2026-06, DIN 18202:2019-07, DIN 4108-2, DIN EN 206; Liu et al. „Lost in the Middle“; MCP-Spezifikation 2024. Befundliste Tranche 14, Nr. 3.

## Prüfschritte für die Freigabe (ca. 15 min)

1. Fehlerquote: 6 von 50 Zitaten falsch → p̂ = 0,12; bei 200 Zitaten erwartet E = 24 fehlerhafte.
2. Mehrheitsentscheid: p = 0,8 je Abfrage, drei unabhängige Abfragen → P(mind. 2 richtig) = 0,512 + 0,384 = 0,896.
3. Vorlage Bedenkenanmeldung: Schriftform nach § 4 Abs. 3 VOB/B mit nachweisbarem Zugang (T14-LP-1).
4. Vorlage Estrich: Ebenheitsanforderung DIN 18202 Tab. 3 – Zeile 2 (12 mm) statt Zeile 3 (10 mm) prüfen (T14-LP-7).
5. Konnektoren und Skills: keine Aussagen mehr wie „verhindert Halluzinationen“ oder „rechtssicher“ (T14-LP-5).

## Empfehlung

**freigabereif.** Sechs Befunde behoben, Rechts- und Normaussagen der Stichprobe richtig; offen ist nur die Tabellenzeile der DIN 18202 in einer Mustervorlage. Die Normpunkte sind in der App gekennzeichnet und gelten nach der Regel vom 02.11.2026 als erledigt.

Bisher „freigabereif nach Klärung von T14-LP-7“. Die offenen Normpunkte (von T14-LP-7) sind in der App als „vorläufig, Normprüfung ausstehend“ gekennzeichnet und gelten nach der Regel vom 02.11.2026 (Entscheidung vom 04.11.2026) für die Freigabe als erledigt. Sie bleiben im Prüfbogen Normtext offen; nach der Normprüfung wird der Wert angepasst.
