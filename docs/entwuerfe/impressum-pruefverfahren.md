# Impressum – Absatz zum Prüfverfahren (Entwurf, 29.10.2026)

Anlass: Gutachten vom 29.10.2026, Abschnitt 4.5 (Recht/Datenschutz, Mangel 1): Kopf („Fachlich geprüft am …“), Fußzeile („nicht geprüft“ bzw. „fachliche Freigabe durch den Autor ausstehend“) und Impressum („redaktionell kontrolliert“) machten auf 119 Seiten unterschiedliche Prüfaussagen. Kopf und Fußzeile werden seit diesem Stand beide aus dem Prüfvermerk (`pruefvermerkFuer()`, `src/data/pruefvermerke.ts`) gespeist. Am Vermerk erklärt ein Info-Hinweis das Verfahren in einem Satz.

**Das Impressum (`src/modules/Impressum.tsx`) ist NICHT geändert.** Der Wortlaut ist zu bestätigen, danach wird der Absatz nach „Hinweis zur Erstellung“ eingefügt.

## Formulierungsvorschlag

> **Fachliche Prüfung:** Die Inhalte wurden in einem dokumentierten Verfahren fachlich geprüft (Nachrechnung, Normstand, Quellen); offene Normstellen sind als „vorläufig“ gekennzeichnet. Der Vermerk „Fachlich geprüft am …“ im Kopf und in der Fußzeile eines Moduls nennt das Datum der abgeschlossenen Prüfung; bei Modulen ohne diesen Vermerk ist die fachliche Prüfung noch in Bearbeitung. Die Prüfung ersetzt keine projektbezogene Fachplanung (siehe „Haftung für Inhalte“).

## Zu entscheiden

1. Wortlaut wie vorgeschlagen bestätigen oder ändern.
2. Optionaler Zusatzsatz zur Transparenz (Gutachten 29.10., 4.5: die Befundlisten wurden maschinell erstellt): „Die Befundlisten wurden KI-gestützt erstellt und vor der Freigabe durchgesehen.“ – aufnehmen ja/nein. Er passt zum bestehenden „Hinweis zur Erstellung“.
3. Ob der Vermerk künftig eine prüfende Person nennen soll (Gutachten 4.5, „Braucht Entscheidung“). Bis dahin bleibt er passiv und ohne Namen.
