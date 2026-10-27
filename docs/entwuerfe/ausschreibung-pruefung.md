# Entwurf: Ausschreibung Bachelorarbeit oder Hilfskraftstelle „Unabhängige Prüfung des BaustoffBoards“

Stand: 27.10.2026 · Entwurf für Prof. Dr.-Ing. Jürgen Huber · Teil A ist der Ausschreibungstext, Teil B bis D sind die Arbeitsunterlagen.

---

## A. Ausschreibungstext

**Technische Hochschule Augsburg · Professur für Werkstoffe und Stoffkreisläufe im Bauwesen · Prof. Dr.-Ing. Jürgen Huber**

### Bachelorarbeit oder studentische Hilfskraft (m/w/d): Gegenrechnung von Baustoff-Rechnern und Nutzertest einer Lernplattform

Das BaustoffBoard (www.baustoffboard.de) ist die interaktive Lernplattform der Professur für Baustoffkunde, Bauen im Bestand und nachhaltiges Bauen. Sie enthält über 50 Rechenkerne, zum Beispiel für Biegebemessung, Mischungsberechnung, Glaser-Verfahren und Mauerwerk. Die Rechenkerne sind mit automatischen Tests abgesichert. Was noch fehlt, ist eine **unabhängige Gegenrechnung von Hand** und ein **Test mit Studierenden**.

**Aufgaben**

1. **Gegenrechnung:** Sie rechnen 10 Rechner der Plattform unabhängig nach: von Hand oder mit einer eigenen Tabellenkalkulation, auf Grundlage der Normen und Fachliteratur aus der Hochschulbibliothek. Je Rechner gibt es mindestens drei Fälle: ein Regelfall, ein Randfall und ein Fall an der Anwendungsgrenze. Sie dokumentieren Abweichungen und begründen sie (Rundung, Vereinfachung, Fehler).
2. **Nutzertest:** Sie führen einen moderierten Nutzertest mit 5 Studierenden durch. Dazu gehören ein Testskript mit 9 Aufgaben, ein Beobachtungsbogen und der System Usability Scale (SUS). Sie werten den Test aus und leiten priorisierte Verbesserungsvorschläge ab.
3. **Bericht:** Sie fassen beide Teile in einem Bericht zusammen. Der Bericht enthält eine Mängelliste mit Fundstelle, Schweregrad und Vorschlag.

**Voraussetzungen**

- Studium Bauingenieurwesen, Architektur oder E2D, ab dem 4. Semester. Baustoffkunde und Grundlagen der Bemessung (Stahlbeton, Holz, Mauerwerk, Bauphysik) sind abgeschlossen.
- Sorgfältiges, nachvollziehbares Arbeiten; sicherer Umgang mit Tabellenkalkulation.
- Programmierkenntnisse sind nicht erforderlich.

**Rahmen**

- Als **Bachelorarbeit**: Bearbeitungszeit und Umfang nach der Studien- und Prüfungsordnung [bitte ergänzen: Studiengang, ECTS]. Möglicher Titel: „Verifikation und Gebrauchstauglichkeit digitaler Lehrwerkzeuge in der Baustoffkunde am Beispiel des BaustoffBoards“.
- Als **Hilfskraftstelle**: [bitte ergänzen: Stunden je Monat, Dauer, Vergütung nach den Sätzen der THA]. Richtwert für den Aufwand: Gegenrechnung etwa 60 h, Nutzertest mit Auswertung etwa 30 h, Bericht etwa 15 h.
- Beginn: [bitte ergänzen]
- Die Ergebnisse fließen in die Plattform ein. Auf Wunsch werden Sie in der Versionshistorie als Mitwirkende/r genannt.

**Kontakt:** Prof. Dr.-Ing. Jürgen Huber, [bitte ergänzen: Raum, Sprechstunde]

---

## B. Gegenrechnung: Auswahl der 10 Rechner

Die Auswahl deckt die wichtigsten Fachgebiete ab. Sie enthält Rechner, die häufig in der Lehre eingesetzt werden, und Rechner, deren Rechenweg von Hand gut nachvollziehbar ist. Alle Kerne liegen in `src/calc/`, die Tests in `tests/`.

| Nr. | Rechner (Modul) | Rechenkern | Gegenstand der Gegenrechnung | Grundlage für die Handrechnung |
|---|---|---|---|---|
| 1 | Biegebemessung | `src/calc/biegung.ts` | Erforderliche Biegezugbewehrung eines Rechteckquerschnitts (ω- bzw. μ-Verfahren) | DIN EN 1992-1-1 mit NA; Bemessungstafeln aus der Fachliteratur |
| 2 | Querkraftbemessung | `src/calc/querkraft.ts` | V_Rd,c ohne Querkraftbewehrung, V_Rd,s mit Bügeln | DIN EN 1992-1-1, 6.2 |
| 3 | Durchstanzen | `src/calc/durchstanzen.ts` | Durchstanzwiderstand am kritischen Rundschnitt | DIN EN 1992-1-1, 6.4 mit NA |
| 4 | Rissbreite | `src/calc/rissbreite.ts` | Rissbreite w_k und Mindestbewehrung | DIN EN 1992-1-1, 7.3 mit NA |
| 5 | Mischungsberechnung | `src/calc/mischung.ts` | Stoffraumrechnung für 1 m³ Beton (Zement, Wasser, Zusatzstoffe, Gesteinskörnung, Luft) | DIN EN 206 / DIN 1045-2; Zement-Merkblätter |
| 6 | Wärmeschutz (Bauphysik) | `src/calc/waermeschutz.ts` | U-Wert und Temperaturverlauf eines mehrschichtigen Bauteils | DIN EN ISO 6946; DIN 4108-4 (Bemessungswerte) |
| 7 | Feuchteschutz (Glaser-Verfahren) | `src/calc/glaser.ts` | Tauwassermasse M_c, Verdunstungsmasse M_ev, Lage der Tauwasserebene | DIN 4108-3, Anhang A/B |
| 8 | Holzbau: Druckstab | `src/calc/holzbau.ts` (`bemesseDruckstab`) | Knickbeiwert k_c und Ausnutzung einer Holzstütze | DIN EN 1995-1-1, 6.3.2 mit NA |
| 9 | Stahlbau EC 3: Biegeknicken | `src/calc/stahlbau.ts` (`biegeknicken`) | χ, N_b,Rd einer Stütze aus Walzprofil | DIN EN 1993-1-1, 6.3.1 mit NA |
| 10 | Mauerwerk: Tragfähigkeit | `src/calc/mauerwerk.ts` | N_Rd einer Wand im vereinfachten Verfahren (Φ1, Φ2, f_d) | DIN EN 1996-3 mit NA |

Ersatzkandidaten, falls ein Rechner während der Arbeit überarbeitet wird: Lebenszykluskosten (`src/calc/lcc.ts`), Festbetonstatistik/Konformität (`src/calc/festbetonStatistik.ts`), Luftschalldämmung (`src/calc/schall.ts`), Stahlbetonstütze (`src/calc/stuetze.ts`).

**Vorgehen je Rechner**

1. Die Eingaben im Rechner einstellen und einen Bildschirmausschnitt des Ergebnisses ablegen.
2. Die Handrechnung unabhängig führen, ohne den Programmcode zu lesen. Grundlage sind Norm, Fachbuch oder Herstellerunterlage.
3. Den App-Wert eintragen und die Abweichung als Prozentwert bilden: (App − Hand) / Hand · 100 %.
4. Bewerten: Bis ±1 % gilt die Abweichung als Rundung. Bei ±1 % bis ±5 % ist sie zu begründen (Vereinfachung, anderer Beiwert). Ab ±5 % liegt ein Befund für Prof. Huber vor.
5. Erst danach in `src/data/rechnerGrenzen.ts` und im Hinweistext des Rechners nachsehen, ob die Abweichung als Vereinfachung dokumentiert ist.

**Protokollvorlage Gegenrechnung**

| Rechner | Fall (Regel / Rand / Grenze) | Eingaben | Handrechnung (Ergebnis, Einheit, Rechenweg als Anlage) | App-Wert | Abweichung [%] | Begründung / Befund |
|---|---|---|---|---|---|---|
| 1 Biegebemessung | Regel | b = … cm, h = … cm, d = … cm, C…/…, B500B, M_Ed = … kNm | A_s,erf = … cm² | … cm² | … | … |
| 1 Biegebemessung | Rand | … | … | … | … | … |
| 1 Biegebemessung | Grenze | … | … | … | … | … |
| 2 Querkraftbemessung | Regel | … | … | … | … | … |
| … | … | … | … | … | … | … |

Für jeden der 10 Rechner werden drei Zeilen ausgefüllt, insgesamt 30 Fälle. Die Rechenwege kommen als Anlage dazu, mit Quelle (Norm, Abschnitt bzw. Gleichung, Fachbuch mit Seite).

---

## C. Nutzertest mit 5 Studierenden

**Teilnehmende:** 5 Studierende aus mindestens zwei Studiengängen und zwei Semesterlagen. Mindestens eine Person nutzt das Mobiltelefon. Keine Person hat am BaustoffBoard mitgearbeitet. Die Teilnahme ist freiwillig und hat keinen Einfluss auf Noten.

**Ablauf je Sitzung (etwa 45 min):** Begrüßung und Einverständnis (5 min), Aufgaben mit lautem Denken (30 min), SUS-Fragebogen (5 min), kurzes Abschlussgespräch (5 min). Die Moderation hilft nur, wenn eine Aufgabe länger als 5 Minuten stockt; das wird als „mit Hilfe“ vermerkt.

**Datenschutz:** Notizen ohne Namen (Kennung P1 bis P5). Bildschirm- oder Tonaufnahmen nur mit schriftlicher Einwilligung; Löschung nach der Auswertung [bitte ergänzen: Abstimmung mit der/dem Datenschutzbeauftragten der THA].

### C.1 Testskript (9 Aufgaben)

Die Aufgaben werden einzeln auf Karten vorgelegt. Sie nennen das Ziel, nicht den Weg.

| Nr. | Aufgabe (Wortlaut für die Teilnehmenden) | Erfolgskriterium | Zielzeit |
|---|---|---|---|
| 1 | „Sie bereiten sich auf die Vorlesung Baustoffkunde vor. Finden Sie heraus, welche Themen in der Woche ab 9. November behandelt werden.“ | Lernpfad Baustoffkunde geöffnet, Termin 6 (Zement und Hydratation) genannt | 2 min |
| 2 | „Wie groß ist die Rohdichte eines Kalksandsteins ungefähr? Suchen Sie den Wert in der Plattform.“ | Wert über Suche oder Kennwerte-Datenbank gefunden | 2 min |
| 3 | „Berechnen Sie die erforderliche Bewehrung für einen Balken b = 30 cm, h = 60 cm, C30/37, M_Ed = 250 kNm.“ | Biegebemessung geöffnet, Eingaben gesetzt, Ergebnis abgelesen | 5 min |
| 4 | „Prüfen Sie, ob in einer Außenwand nach dem Glaser-Verfahren Tauwasser ausfällt. Verwenden Sie den voreingestellten Aufbau und ändern Sie die Dämmstoffdicke auf 20 cm.“ | Feuchteschutz geöffnet, Dicke geändert, Aussage zu M_c und M_ev getroffen | 5 min |
| 5 | „Lesen Sie nach, welche Annahmen und Grenzen für den Rechner aus Aufgabe 3 gelten.“ | Hinweis „Annahmen und Grenzen“ gefunden und eine Grenze genannt | 2 min |
| 6 | „Testen Sie Ihr Wissen zum Modul Mauerwerk mit dem Selbsttest und beantworten Sie mindestens drei Fragen.“ | Selbsttest gestartet, drei Fragen beantwortet, Rückmeldung verstanden | 4 min |
| 7 | „Laden Sie das Laborhandout zur Druckfestigkeit von Betonwürfeln herunter oder drucken Sie es aus.“ | Handout gefunden, PDF-Export ausgelöst | 3 min |
| 8 | „Stellen Sie die Plattform auf Dunkelmodus und eine größere Schrift um.“ | beide Einstellungen gefunden und gesetzt | 2 min |
| 9 | „Sie haben einen Fehler entdeckt. Wo würden Sie ihn melden?“ | Feedback- bzw. Kontaktweg gefunden | 2 min |

Hinweis für die Moderation: Die Werte in Aufgabe 3 und 4 vorab im Rechner prüfen und das erwartete Ergebnis auf dem Beobachtungsbogen notieren [bitte ergänzen vor dem ersten Test].

### C.2 Beobachtungsbogen (je Teilnehmer/in und Aufgabe)

| Feld | Eintrag |
|---|---|
| Kennung / Datum / Gerät (Desktop, Tablet, Mobil) / Browser | P… / … / … / … |
| Aufgabe Nr. | … |
| Ergebnis | [ ] gelöst ohne Hilfe  [ ] gelöst mit Hilfe  [ ] nicht gelöst  [ ] abgebrochen |
| Zeit bis zur Lösung (min:s) | … |
| Gewählter Weg (Klickfolge, Suche, Menü) | … |
| Umwege, Fehlklicks, Rücksprünge | … |
| Zitate beim lauten Denken | „…“ |
| Beobachtetes Problem | … |
| Schweregrad | [ ] 1 kosmetisch  [ ] 2 gering  [ ] 3 erheblich  [ ] 4 verhindert die Lösung |
| Fachliche Auffälligkeit (Wert, Begriff, Einheit) | … |
| Idee der Moderation zur Abhilfe | … |

Auswertung: Erfolgsquote und mittlere Zeit je Aufgabe, Liste der Probleme mit Häufigkeit (wie viele der 5 Personen) und Schweregrad, die 5 wichtigsten Verbesserungen.

### C.3 SUS-Fragebogen (deutsch)

Antwort je Aussage auf einer Skala von 1 = „stimme überhaupt nicht zu“ bis 5 = „stimme voll zu“. „System“ meint das BaustoffBoard. Wortlaut nach der deutschen Übersetzung von B. Rummel (SAP, 2013); vor dem Einsatz mit dem Originaldokument abgleichen.

| Nr. | Aussage | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|---|
| 1 | Ich denke, dass ich das System gerne häufig benutzen würde. | [ ] | [ ] | [ ] | [ ] | [ ] |
| 2 | Ich fand das System unnötig komplex. | [ ] | [ ] | [ ] | [ ] | [ ] |
| 3 | Ich fand das System einfach zu benutzen. | [ ] | [ ] | [ ] | [ ] | [ ] |
| 4 | Ich glaube, ich würde die Hilfe einer technisch versierten Person benötigen, um das System benutzen zu können. | [ ] | [ ] | [ ] | [ ] | [ ] |
| 5 | Ich fand, die verschiedenen Funktionen in diesem System waren gut integriert. | [ ] | [ ] | [ ] | [ ] | [ ] |
| 6 | Ich denke, das System enthielt zu viele Inkonsistenzen. | [ ] | [ ] | [ ] | [ ] | [ ] |
| 7 | Ich kann mir vorstellen, dass die meisten Menschen den Umgang mit diesem System sehr schnell lernen. | [ ] | [ ] | [ ] | [ ] | [ ] |
| 8 | Ich fand das System sehr umständlich zu nutzen. | [ ] | [ ] | [ ] | [ ] | [ ] |
| 9 | Ich fühlte mich bei der Benutzung des Systems sehr sicher. | [ ] | [ ] | [ ] | [ ] | [ ] |
| 10 | Ich musste eine Menge lernen, bevor ich anfangen konnte, das System zu verwenden. | [ ] | [ ] | [ ] | [ ] | [ ] |

**Auswertung:** Bei den ungeraden Aussagen (1, 3, 5, 7, 9) zählt der Antwortwert minus 1. Bei den geraden Aussagen (2, 4, 6, 8, 10) zählt 5 minus Antwortwert. Die Summe wird mit 2,5 multipliziert und ergibt den SUS-Wert von 0 bis 100. Bei 5 Personen werden die Einzelwerte und der Mittelwert berichtet; eine statistische Aussage ist bei dieser Zahl nicht möglich. Zur Einordnung dient ein Vergleichswert von etwa 68 als durchschnittliche Gebrauchstauglichkeit.

---

## D. Quellen

- Brooke, J.: SUS – A quick and dirty usability scale. In: Jordan, P. W. u. a. (Hrsg.): Usability Evaluation in Industry. London: Taylor & Francis, 1996, S. 189–194.
- Rummel, B.: System Usability Scale – jetzt auch auf Deutsch. SAP Community (Übersetzung von 2013), <https://community.sap.com/t5/additional-blog-posts-by-sap/system-usability-scale-jetzt-auch-auf-deutsch/ba-p/13487686>
- Vergleichswert 68 und Auswertung: Sauro, J.: A Practical Guide to the System Usability Scale. Denver: Measuring Usability LLC, 2011 [bitte ergänzen: am Original prüfen].
- Rechenkerne und Tests: `src/calc/*.ts`, `tests/*.test.ts`; Annahmen und Grenzen: `src/data/rechnerGrenzen.ts`.
