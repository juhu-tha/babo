# Freigabepaket: Recht & Grundlagen (VOB/BGB) (`bauschaeden`)

Stand 04.11.2026 · Gruppe „Mängel & Schäden“ · Typ `norm` · Prüfvermerk „geprüft“ vom 29.10.2026; Inhalt seitdem wesentlich geändert (siehe Abschnitt „Änderungen seit dem Prüfdatum“).

**Empfehlung: freigabereif** – Der Umzug hat Inhalt nur entfernt; der verbliebene Inhalt ist geprüft (Tranche 13, Durchsicht C, Nachstichprobe 3). Der bestehende Prüfvermerk kann nach Kontrolle des Verweises bleiben.

Dieses Paket bereitet die Freigabe vor. Es setzt keinen Prüfvermerk; die Freigabe trägt die prüfende Person in `src/data/pruefvermerke.ts` ein.

## Zweck

Recht und Grundlagen der Bauschadensbewertung für Bauen im Bestand (Termin 3): Mangel und Schaden, Gewährleistung und Verjährung nach BGB und VOB/B, Beweislast und Beweisverfahren, BGH-Rechtsprechung, Gebäudetyp E, Anzeigen-Generator (Bedenken-, Behinderungs-, Nachtragsanzeige), Technikstufen, Sachverständige, Rollen und Versicherungen.

Bedeutung für die Lehre: Lehrveranstaltung (Vertiefung, Wahlpflicht, Master, Weiterbildung); Lernpfade: Bauen im Bestand.

## Reiter und Bereiche

Seit 02.11.2026 ohne den Reiter Kleb- und Dichtstoffe; an seiner Stelle ein Verweis mit Direktsprung nach `schadensbilder` (`src/modules/Bauschaeden.tsx:349`).

Komponente `src/modules/Bauschaeden.tsx`; Inhalt `content/bauschaeden/Bauschaeden.json`.

## Rechenkerne und Testabdeckung

Kein Rechenkern; die Fristenbeispiele sind in Tranche 13 und Nachstichprobe 3 nachgerechnet.

## Bisherige Befunde

| Kennung | Befund | Status | Fundstelle |
|---|---|---|---|
| T13-BS-1 | Abgebrochener Satz „Stand von Wissenschaft und Technik“ (ProdHaftG) | erledigt (behoben) | T13 (`module-tranche-13.md`) (Nr. 1) |
| T13-BS-2 | Anzeigen-Generator mit Personenname und realer Hochschule → neutrale Platzhalter | erledigt (umgesetzt) (#264) | T13 (`module-tranche-13.md`) |
| DSC-BS-1 | Gebäudetyp E: Stand überholt → Entwurf vom 26.10.2026 | erledigt (behoben) | `durchsicht-C-2026-10-29.md`; bestätigt in `gegenpruefung-2026-10-30.md` |
| NS3-BS-1 | Musterschreiben „F90 statt der geplanten F60 Brandwand“ → Trennwand F 90/EI 90 statt hochfeuerhemmend | erledigt (behoben) | `nachstichprobe3-2026-10-30.md` |
| Hinweis | Temperaturspanne 60 K (Fließtext) neben 80 K (Beispiel) – verschiedene Bezugsgrößen; Beispiel jetzt in `schadensbilder` | kein Handlungsbedarf | `durchsicht-C-2026-10-29.md` |

## Offene Normpunkte

Keine.

## Quizfragen

6 Fragen, alle freigegeben.

## Änderungen seit dem Prüfdatum

Seit der Freigabe vom 29.10.2026: **#317** (02.11., Commit ee2547a2) hat den Reiter „Kleb- und Dichtstoffe“ samt Beispiel Mindestfugenbreite, Lernzielen, Kurzfassung und Suchbegriffen nach `schadensbilder` verschoben (`src/modules/Bauschaeden.tsx` −242 Zeilen, `content/bauschaeden/Bauschaeden.json` −120 Zeilen); hier steht nur noch ein Verweis. Dazu kleinere Textkorrekturen aus Nachstichprobe 3 (NS3-BS-1) und Durchsicht A. Neuer Fachinhalt ist nicht hinzugekommen.

## Quellen

BGB (§§ 195, 199, 204, 634a, 650t), VOB/B 2016 (§§ 4, 6, 13), ZPO § 404, ProdHaftG; BGH VII ZR 46/17, V ZR 33/19; Gebäudetyp-E-Gesetzentwurf 26.10.2026. Befundliste Tranche 13, Nr. 1; Durchsicht C; Nachstichprobe 3.

## Prüfschritte für die Freigabe (ca. 15 min)

1. Verjährung Beispiel 1: Abnahme 15.03.2021 → BGB 15.03.2026 (§ 634a Abs. 1 Nr. 2), VOB/B 15.03.2025 (§ 13 Abs. 4 Nr. 1); schriftliche Mängelrüge 10.01.2025 → 10.01.2027 (§ 13 Abs. 5 Nr. 1).
2. Musterschreiben Nachtragsanzeige: „Trennwand feuerbeständig (F 90 bzw. EI 90) statt der geplanten hochfeuerhemmenden Ausführung“ (NS3-BS-1).
3. Anzeigen-Generator: neutrale Platzhalter statt Namen (T13-BS-2).
4. Verweis „Kleb- und Dichtstoffschäden → Typische Bauschäden“ öffnen: Direktsprung auf den Reiter in `schadensbilder` (`content/bauschaeden/Bauschaeden.json:106`).
5. Lernziele und Kurzfassung von `bauschaeden` nennen keine Fugen-/Dichtstoffziele mehr (in `schadensbilder` übernommen).

## Empfehlung

**freigabereif.** Seit dem Prüfdatum ist kein neuer Fachinhalt dazugekommen; der Reiter Kleb- und Dichtstoffe steht jetzt in `schadensbilder` und wird dort mit geprüft. Zu bestätigen ist nur, dass Verweis, Lernziele und Kurzfassung nach dem Umzug stimmen (Prüfschritte 4 und 5). Kein Normpunkt offen.
