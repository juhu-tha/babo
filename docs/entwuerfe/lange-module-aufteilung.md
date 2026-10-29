# Lange Module aufteilen (Entwurf, Stand 28.10.2026)

Offener Punkt aus Z53 (27.10.2026): „Module über 10 000 Wörter in eigenständige Teilmodule aufteilen?“
Vorgeschlagenes Vorgehen (noch nicht ausdrücklich bestätigt, daher behutsam): Aufteilung nach Reitern in
2–3 Teilmodule mit gemeinsamer Kurzfassung, die alte Adresse leitet auf Teil 1 weiter.

Dieser Entwurf enthält (1) die Wortzählung, (2) das umgesetzte Muster für die zwei längsten Module und
(3) den Vorschlag für das übrige Modul über der Schwelle.

## 1. Wortzählung

Zählweise wie `tests/kurzfassung.test.ts` (`ansichtWoerter` in `tests/hilfen/fliesstext.ts`): sichtbarer
Fließtext unter der Modul-ID aus TSX-Texten und den referenzierten `content/**/*.json`, ohne Formeln, Code und Quiz.
Die Zählung erfasst alle Reiter, Datensätze und Zweige, die sie nicht sicher ausschließen kann; sie liegt daher eher
über dem, was eine Leserin auf einmal sieht.

Module über 10 000 Wörter (Stand main, 28.10.2026, vor der Aufteilung):

| Modul | Wörter | Reiter | Stand |
|---|---:|---|---|
| `bauwerksuntersuchung` (Bauwerksdiagnose & ZfP) | 14 971 | Diagnose-Phasen · Prüfumfang & Konditionierung · Interpretation & Anwendung · Prüfkatalog (14 Verf.) · DGZfP & Ausbildung | **aufgeteilt** (3 Teile) |
| `spannbeton` (Spannbeton) | 13 213 | 0-100 · Grundprinzipien · Baustoffkennwerte (Kriechen, Schwinden, Relaxation) · Querschnitts-Rechner & Spannungsverlauf · Dauerhaftigkeit & Korrosionsschutz | **aufgeteilt** (2 Teile) |
| `bauwerksunters_monitoring` (Tragwerksmonitoring) | 10 890 | Tragwerks-Monitoring (SHM) · Holzdiagnostik (Resistographie) · Schadens-/Feuchterechner · ZfP-Prüfkatalog (konsolidiert) | Vorschlag, Abschnitt 3 |

Die parallel in Prüfung befindlichen Module (Tranche 3 und Prüfvermerk-Tranchen) liegen alle unter der Schwelle und
bleiben unberührt: sommerlicher Wärmeschutz 1425, Bauphysik/U-Wert 1005, Mauerwerk 1184, Frischbeton 1466,
Hydratation 5509, Expositionsklassen 2232, Stahlbau EC3 1211, Asphalt 1686, Brandschutz 710, Schallschutz 1166,
Stahlbeton-Bemessung 5421.

Beobachtungsliste 5000–10 000 Wörter (keine Aufteilung nötig, Kurzfassung und Reiter vorhanden): `lca_rechner` 7407,
`material_schaeden_gross` 6219, `abfaelle` 5690, `hydratation_folgen` 5509, `lca_regulatorik` 5489,
`stahlbeton_bemessung` 5421, `schadstoffe` 5394.

## 2. Umgesetztes Muster

### Bauwerksdiagnose (`bauwerksuntersuchung` → 3 Teilmodule)

| Teil | ID | Titel (Menü) | Reiter | Wörter | Fragen |
|---|---|---|---|---:|---:|
| 1 | `bauwerksdiagnose` | Bauwerksdiagnose | Diagnose-Phasen · Prüfumfang & Konditionierung · Interpretation & Anwendung (+ Rechenbeispiele 1 und 2) | 7407 | 4 |
| 2 | `pruefverfahren_katalog` | Prüfverfahren-Katalog | Prüfkatalog (14 Verf.) | 10 345* | 1 |
| 3 | `zfp` | ZfP-Simulatoren & DGZfP | DGZfP & Ausbildung (ZfP-Lehrsimulatoren, Geräte, DGZfP) | 3592 | 1 |

\* knapp über 10 000: Der Katalog zeigt je ein Verfahren aus 14 Datensätzen, gezählt werden alle Datensätze und die mit
Teil 1 geteilten Diagnosedaten (`diagnoseData.ts`). Weiter teilen ließe er sich nur innerhalb eines Datensatzes;
`tests/teilmodule.test.ts` hält den Wert als Ratsche (≤ 10 400).

Begründung: Zwei Teile reichten nicht – Katalog und ZfP zusammen ergaben 13 229 Wörter. Die drei Teile folgen den
fachlichen Schritten Ablauf/Bewertung → Verfahren nachschlagen → Verfahren üben. `zfp` war bereits eigene Adresse
(Direktlink auf den Reiter DGZfP & Ausbildung) und ist jetzt vollwertiges Teilmodul.

### Spannbeton (`spannbeton` → 2 Teilmodule)

| Teil | ID | Titel (Menü) | Reiter | Wörter | Fragen |
|---|---|---|---|---:|---:|
| 1 | `spannbeton_grundlagen` | Spannbeton: Grundlagen | 0-100 · Grundprinzipien · Dauerhaftigkeit & Korrosionsschutz | 7735 | 6 |
| 2 | `spannbeton_kennwerte` | Spannbeton: Kennwerte & Rechner | Baustoffkennwerte · Querschnitts-Rechner & Spannungsverlauf | 6116 | 4 |

Begründung: Teil 1 erklärt Prinzip, Verfahren, Nachweiskonzept und Dauerhaftigkeit (verbal, mit Lehrdemos), Teil 2
bündelt Kennwerte und Rechner (Spannkraftverluste, Randspannungen). Drei Teile hätten einen Teil mit unter
2000 Wörtern und einer Quizfrage ergeben.

### Was bei der Aufteilung geändert wurde (Checkliste für weitere Module)

1. **Registry** (`src/registry/modules.ts`): neue Einträge je Teil (Menügruppe, Baum, Meta, Suchbegriffe), alte ID
   entfernt und als Alias auf Teil 1 eingetragen (`TAB_ALIASES`, wie `'zertifizierung' → 'zertifizierung_siegel'`),
   Baumknoten nebeneinander. Familie in `src/registry/teilmodule.ts` (`TEILMODULE`).
2. **Routing** (`src/routing/ModulInhalt.tsx`): je Teil `<Komponente bereiche={[…]} />`; die Komponente blendet
   Reiter über `bereiche.includes('…')` aus und kennt die Zuordnung Reiter → Teilmodul (`…_TEIL`), damit Querverweise
   („Zu den Baustoffkennwerten“, „Alle Prüfverfahren im Detailkatalog“) ins richtige Teil mit dem richtigen Reiter
   springen. Texte wurden nicht verändert, nur verteilt.
3. **Modulkopf**: „Teil n von m“ mit Links auf alle Teile (`src/components/ui/TeilmodulNavigation.tsx`).
4. **Kurzfassung** gemeinsam (eine Konstante für alle Teile), alle Teile in `KURZFASSUNG_PFLICHT`.
5. **Lernziele, Erkundung, Grenzen, Prüfvermerk** je Teil nach Reitern verteilt; wo ein Teil die Mindestform
   (3 Lernziele, 2 Erkundungsaufträge bei Rechnern) nicht erreichte, wurden wenige Einträge neu formuliert
   (Kennzeichnung „neu bei der Aufteilung, Prüfpunkt“ im Code).
6. **Quiz**: `moduleId` und Sprungziel (`gapAnalysis.targetModuleTab`) der Fragen nach Reiter neu zugeordnet, Fragetexte
   unverändert. Mindestzahl (6, Spannbeton 10) und Rechenfrage gelten für die Familie; Teile unter 6 Fragen stehen in
   der Ratsche `TEIL_UNTER_MINDEST` (`tests/quiz.test.ts`).
7. **Querverweise**: Lernziel-Vorwissen, Lernpfade, Übungsaufgaben-Hinweise, Lebensdauer-Übergabe, englische
   Menütexte, Komponententests der Suche, Sitemap und Suchindex.
8. **Tests**: `tests/teilmodule.test.ts` (Alias, Routen, Reiterzuordnung, Wortzahl je Teil, Kurzfassung, Lernziele,
   Prüfvermerk) sowie die bestehenden Registry-, Kurzfassungs-, Quiz- und Verwaist-Prüfungen.

### Offene Punkte

- ~~**Quizfragen aufstocken**~~ – **Umsetzung 29.10.2026 (QZ-6):** 14 neue Fragen `qt_*` (`spannbeton_kennwerte` +2,
  `bauwerksdiagnose` +2, `pruefverfahren_katalog` +5, `zfp` +5), alle Teile jetzt mit 6 Fragen; `TEIL_UNTER_MINDEST` ist
  leer. Rechenfragen gegen die Kerne in `tests/quizRechenfragen.test.ts`; die Fragen sind noch nicht fachlich
  freigegeben (Prüflisten, `NEU_SEIT_26_10` in scripts/auditDaten.ts).
- **Neu formulierte Einträge prüfen**: Lernziele (`spannbeton_kennwerte` Ziel 1, `pruefverfahren_katalog` Ziel 2,
  `zfp` Ziel 2), Erkundungsaufträge (`spannbeton_grundlagen` 2, `bauwerksdiagnose` 2) und die Kurzbeschreibungen der
  Rechnergrenzen `spannbeton_grundlagen`, `bauwerksdiagnose`, `pruefverfahren_katalog`. Die Zahlen der Aufträge sind
  mit den Rechenkernen (`src/calc/spannbeton.ts`, `src/calc/bauwerksuntersuchung.ts`) nachgerechnet.
- **Prüfvermerke**: alle Teile stehen auf „offen“ wie zuvor die Stammmodule.
- Der Reiter „DGZfP & Ausbildung“ heißt im Teil 3 weiter so, obwohl er die ZfP-Simulatoren enthält; die Überschriften
  im Modul wurden bewusst nicht geändert.

## 3. Vorschlag für das übrige Modul

### Tragwerksmonitoring (`bauwerksunters_monitoring`, 10 890 Wörter)

Rund 9600 Wörter stammen aus dem eingebetteten Reiter „ZfP-Prüfkatalog (konsolidiert)“, der dieselbe Komponente
`PruefverfahrenKatalog` wie das neue Teilmodul `pruefverfahren_katalog` zeigt. Das Modul selbst hat ohne den Katalog
rund 1300 Wörter.

Vorschlag: **nicht teilen**, sondern den Reiter „ZfP-Prüfkatalog (konsolidiert)“ durch einen Querverweis auf
`/modul/pruefverfahren_katalog` ersetzen (Reiter bleibt mit Kurzhinweis und Schaltfläche oder entfällt).

| Teil | ID | Titel | Reiter | Wörter (geschätzt) |
|---|---|---|---|---:|
| – | `bauwerksunters_monitoring` (bleibt) | Tragwerksmonitoring (SHM) | Tragwerks-Monitoring · Holzdiagnostik · Schadens-/Feuchterechner · (Verweis Prüfkatalog) | ≈ 1300 |

Begründung: Der Katalog ist dann an einer Stelle gepflegt und gezählt; Quizfragen, Lernziele und Erkundung des
Monitorings bleiben unverändert (Lernziel 5 „Verfahren aus dem ZfP-Methodenkatalog auswählen“ verweist dann auf das
Teilmodul). Alias oder Weiterleitung sind nicht nötig, die Adresse bleibt.
