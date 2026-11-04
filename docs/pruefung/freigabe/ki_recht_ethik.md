# Freigabepaket: Fehler, Recht & Ethik (`ki_recht_ethik`)

Stand 04.11.2026 · Gruppe „KI im Bauwesen“ · Typ `norm` · Prüfvermerk „offen“ (Prüfung ausstehend).

**Empfehlung: freigabereif nach Klärung von T14-RE-2** – Rechtsstand und Zahlenbeispiele richtig, T14-RE-1 behoben; offen ist, ob der Praxisfall γ_c = 1,35 als „falsch“ bezeichnen darf (NA DE, Fertigteile).

Dieses Paket bereitet die Freigabe vor. Es setzt keinen Prüfvermerk; die Freigabe trägt die prüfende Person in `src/data/pruefvermerke.ts` ein.

## Zweck

Fehler, Recht und Ethik beim KI-Einsatz im Master „KI im Bauwesen“: Halluzinations-Praxisfälle aus dem Bauwesen, Haftung nach BGB/HOAI, EU-KI-Verordnung mit Fristen (Digital Omnibus 2026/1744), DSGVO, Geschäftsgeheimnisse, Urheberrecht, Risiko-Check.

Bedeutung für die Lehre: Lehrveranstaltung (Vertiefung, Wahlpflicht, Master, Weiterbildung); Lernpfade: KI im Bauwesen (Master).

## Reiter und Bereiche

Reiter „Fehler, Recht & Ethik“ der Komponente KiBaustoffe.

Komponente `src/modules/KiBaustoffe.tsx`; Inhalt `content/ki/FehlerRechtEthik.json`, `content/ki/KiDeklarationGuide.json`, `content/ki/KiGlossar.json`, `content/ki/KiOnlinekurse.json`, `content/ki/KiUeberblick.json`, `content/ki/LlmPraxis.json`, `content/ki/LlmPraxisTeile/BrowserTab.json`, `content/ki/LlmPraxisTeile/MarkdownTab.json`, `content/ki/LlmPraxisTeile/SkillsKonnektorenTab.json`, `content/ki/LlmPraxisTeile/VerzeichnisseTab.json`, `content/ki/LokaleKI.json`, `content/ki/ModelBenchmarkMatrix.json`, `content/ki/RagDemonstrator.json`, `content/ki/Systemarchitektur.json`, `content/ki/ToolsFuerThesen.json`, `content/ki/ueberblick/AusblickTab.json`, `content/ki/ueberblick/HistorieTab.json`, `content/ki/ueberblick/KernbegriffeTab.json`, `content/ki/ueberblick/PipelineTab.json`, `content/ki/ueberblick/StandTab.json`, `content/ki/ueberblick/VergleichTab.json`, `content/ki/ueberblick/daten.json`, `content/kibaustoffe/KiBaustoffe.json`.

## Rechenkerne und Testabdeckung

Kein Rechenkern; drei Zahlenbeispiele (Fristen, Bußgeld, Einheiten) in Tranche 14 nachgerechnet. Fristen der KI-VO zentral in `src/data/fristenSchwellen.ts` (Rechtsstand 11/2026).

## Bisherige Befunde

| Kennung | Befund | Status | Fundstelle |
|---|---|---|---|
| T14-RE-1 | Praxisfall Teilsicherheitsbeiwerte „ausnahmslos γ_c = 1,50“ widersprach der Bestandsbewertung (DBV) → Neubau 1,50/1,15, Abminderungen nur in geregelten Fällen; Fundstelle 2.4.2.4 mit NA | erledigt (behoben) | T14 (`module-tranche-14.md`) (Nr. 5) |
| T14-RE-2 | Fertigteile mit Werksüberwachung: γ_c = 1,35 nach NA DE zu 2.4.2.4? Dann wäre der „falsche“ KI-Wert 1,35 teilweise richtig; Vorschlag: Praxisfall auf γ_s = 1,10 zuspitzen | offen (Normtext) | T14 (`module-tranche-14.md`) |
| Hinweis | „Frontier-Reasoning-Anfrage 10- bis 30-fach einer Suche“ als Schätzung ohne Quelle | kein Handlungsbedarf | T14 (`module-tranche-14.md`) |

## Offene Normpunkte

Diese Punkte sind im Modul als „vorläufig, Normprüfung ausstehend“ gekennzeichnet und lassen sich nur am Normtext klären. Kennungen nach dem Prüfbogen Normtext (Stand 28.10.2026) bzw. nach der Befundliste; Zeilenangaben in „Wert in der App“ vom Stand des Prüfbogens.

| Kennung | Norm, Fundstelle | Zu prüfen | Wert in der App |
|---|---|---|---|
| T14-RE-2 | DIN EN 1992-1-1/NA:2013-04, NDP zu 2.4.2.4 | Abgeminderter Teilsicherheitsbeiwert γ_c für Fertigteile mit werksmäßiger Herstellung und ständiger Überwachung (1,35?) | Praxisfall `content/ki/FehlerRechtEthik.json:94` |

## Quizfragen

7 Fragen, davon 1 nicht freigegeben: `qlz_ki_recht_ethik_1`.

## Quellen

VO (EU) 2024/1689 (KI-VO) und VO (EU) 2026/1744 (Digital Omnibus), DSGVO Art. 83, GeschGehG, UrhG, BGB/HOAI; DIN EN 1992-1-1/NA. Befundliste Tranche 14, Nr. 5; Rechtsstand `docs/pruefung/rechtsstand-2026-11.md`.

## Prüfschritte für die Freigabe (ca. 15 min)

1. Frist: 20.10.2026 → 02.12.2027 (Hochrisiko Anhang III) = 408 Tage ≈ 13,4 Monate.
2. Bußgeld: Umsatz 800 Mio. € → max(20; 0,04·800 = 32) = 32 Mio. €; Umsatz 5 Mio. € → 20 Mio. €.
3. Praxisfall Einheiten: σ = 25 N/mm² = 25 000 kN/m², A = 0,15 m² → N = 3750 kN.
4. Praxisfall Teilsicherheitsbeiwerte: „γ_c = 1,35 und γ_s = …“ als KI-Fehler (`content/ki/FehlerRechtEthik.json:94`) – prüfen, ob der NA für Fertigteile 1,35 zulässt; dann Fall auf einen eindeutig falschen Wert umstellen (T14-RE-2).
5. KI-VO-Fristen: Verbote und KI-Kompetenz 02.02.2025, GPAI 02.08.2025, Art. 50 02.08.2026, Anhang III 02.12.2027, Anhang I 02.08.2028.

## Empfehlung

**freigabereif nach Klärung von T14-RE-2.** Rechtsstand und Zahlenbeispiele richtig, T14-RE-1 behoben; offen ist, ob der Praxisfall γ_c = 1,35 als „falsch“ bezeichnen darf (NA DE, Fertigteile).

Nach der Regel der Freigabe vom 02.11.2026 (Tranche 16: im Modul gekennzeichnete Normtextpunkte gelten als erledigt) wäre das Modul schon jetzt freigabereif; nach der Regel vom 28.10.2026 (Normtextpunkte blockieren) erst nach dem Normtextabgleich. Siehe `README.md`, Abschnitt „Zu entscheiden“.
