# Freigabepaket: Produktherstellung & QS (`px_produktion`)

Stand 04.11.2026 · Gruppe „Praxiswissen“ · Typ `standard` · Prüfvermerk „offen“ (Prüfung ausstehend).

**Empfehlung: freigabereif nach Klärung von T9-GL-1a** – Beide Befunde erledigt, Rechenbeispiele richtig; offen sind nur die RC-Höchstanteile (derselbe Normtextpunkt wie in `grundlagen`).

Dieses Paket bereitet die Freigabe vor. Es setzt keinen Prüfvermerk; die Freigabe trägt die prüfende Person in `src/data/pruefvermerke.ts` ein.

## Zweck

Praxiswissen Produktherstellung: Fertigungstechnik mineralischer Baustoffe im Werk, werkseigene Produktionskontrolle (WPK), Konformitätsnachweise nach BauPVO, Dosiergenauigkeit, Feuchtekorrektur, Audits.

Bedeutung für die Lehre: Ergänzung und Nachschlagen; in keinem Lernpfad zugeordnet.

## Reiter und Bereiche

Reiter „Produktherstellung & QS“ der Komponente Praxiswissen.

Komponente `src/modules/Praxiswissen.tsx`; Inhalt `content/praxiswissen/Praxiswissen.json`.

## Rechenkerne und Testabdeckung

Kein Rechenkern; zwei Rechenbeispiele in Tranche 15 nachgerechnet.

## Bisherige Befunde

| Kennung | Befund | Status | Fundstelle |
|---|---|---|---|
| T15-PR-1 | RC-Gesteinskörnung nach DAfStb-Richtlinie (2010) → DIN 1045-2:2023-08, Anhang E (Typ 1 25–45, Typ 2 20–35 Vol.-%, XA2/XA3/XM unzulässig) wie Kern `rcGesteinskoernung.ts` | erledigt (umgesetzt, als vorläufig gekennzeichnet) | T15 (`module-tranche-15.md`) (Nr. 9); Normtext T9-GL-1a |
| T15-PR-2 | System 2+: „Zertifikat der Konformität der WPK“ statt „Konformitätszertifikat“ | erledigt (behoben) | T15 (`module-tranche-15.md`) |

## Offene Normpunkte

Diese Punkte sind im Modul als „vorläufig, Normprüfung ausstehend“ gekennzeichnet und lassen sich nur am Normtext klären. Kennungen nach dem Prüfbogen Normtext (Stand 28.10.2026) bzw. nach der Befundliste; Zeilenangaben in „Wert in der App“ vom Stand des Prüfbogens.

| Kennung | Norm, Fundstelle | Zu prüfen | Wert in der App |
|---|---|---|---|
| T9-GL-1a (Nr. 19) | DIN 1045-2:2023-08, Anhang E | RC-Höchstanteile Typ 1/Typ 2 je Expositionsklasse | Text in `content/praxiswissen/Praxiswissen.json` (wie Kern `src/calc/rcGesteinskoernung.ts`) |

## Quizfragen

6 Fragen, alle freigegeben.

## Quellen

VO (EU) 2024/3110 (BauPVO, anwendbar seit 08.01.2026), VO (EU) 305/2011, DIN 1045-2:2023-08 Anhang E, DIN EN 206. Befundliste Tranche 15, Nr. 9.

## Prüfschritte für die Freigabe (ca. 15 min)

1. Feuchtekorrektur: 1000 kg Sand mit 4 % Eigenfeuchte → 1040 kg einwiegen, Zugabewasser 125 kg; ohne Korrektur w/z = 0,683.
2. Konformität Erstherstellung: f_cm = 41,0 ≥ f_ck + 4 = 41 und f_ci,min = 39 ≥ f_ck − 4 = 33 → erfüllt.
3. System 2+: notifizierte Stelle stellt das Zertifikat der Konformität der WPK aus (T15-PR-2).
4. RC-Höchstanteile Typ 1 25–45, Typ 2 20–35 Vol.-% je Expositionsklasse (vorläufig) – wie `grundlagen` am Anhang E prüfen.
5. Fakten: BauPVO (EU) 2024/3110 anwendbar seit 08.01.2026; Dosiergenauigkeit ±3/±5 %; DEF-Grenze 60–65 °C.

## Empfehlung

**freigabereif nach Klärung von T9-GL-1a.** Beide Befunde erledigt, Rechenbeispiele richtig; offen sind nur die RC-Höchstanteile (derselbe Normtextpunkt wie in `grundlagen`).

Nach der Regel der Freigabe vom 02.11.2026 (Tranche 16: im Modul gekennzeichnete Normtextpunkte gelten als erledigt) wäre das Modul schon jetzt freigabereif; nach der Regel vom 28.10.2026 (Normtextpunkte blockieren) erst nach dem Normtextabgleich. Siehe `README.md`, Abschnitt „Zu entscheiden“.
