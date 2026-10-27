# Datenschutzerklärung – Ergänzungen zur Abstimmung mit dem DSB (Entwurf, 27.10.2026)

Anlass: unabhängiges Gutachten vom 27.10.2026 (Recht, Note 2,0) – es fehlen die Speicherdauer der Server-Protokolle und die Angabe zu Google als Auftragsverarbeiter. **Nichts davon ist in `src/modules/Datenschutz.tsx` übernommen**, bis der Datenschutzbeauftragte (DSB) der THA zugestimmt hat (Z11/Z39). Die Stelle im Code ist mit einem Kommentar „OFFEN (Gutachten 27.10.2026 …)“ markiert.

## 1. Speicherdauer der Server-Protokolle (Abschnitt 2)

**Belegter Sachstand (Google-Dokumentation):** Cloud Run schreibt Anfrageprotokolle (IP-Adresse, Zeit, URL, Statuscode, Datenmenge, User-Agent) nach Cloud Logging, Bucket `_Default`. Laut Google gilt: „Cloud Logging retains the log entries in the `_Default` bucket for 30 days“, sofern keine eigene Aufbewahrungsdauer eingestellt ist; die Dauer ist einstellbar. Der Bucket `_Required` (400 Tage, nicht änderbar) enthält Audit- und Systemereignisse des Projekts, keine Anfrageprotokolle der Besucher.
Quelle: Google Cloud, „Store log entries“ / Cloud Logging, Abschnitt zu `_Default`/`_Required` – https://docs.cloud.google.com/logging/docs/store-log-entries (abgerufen 27.10.2026).

**Vor Übernahme zu prüfen (Betrieb, docs/betrieb-cloud-run.md):**
- Ist im Projekt eine abweichende Aufbewahrung für `_Default` eingestellt (`gcloud logging buckets describe _Default --location=global`)?
- Gibt es Senken (Sinks) in andere Buckets, BigQuery oder Cloud Storage? Dann gilt deren Aufbewahrung.
- Load Balancer (Weg B, Z50/Z56): Protokollierung am Backend-Dienst aktiv? Diese Einträge landen ebenfalls in `_Default`.
- Wünscht der DSB eine kürzere Frist (z. B. 7 oder 14 Tage)? Dann Aufbewahrung des Buckets entsprechend setzen und die Zahl im Text anpassen.

**Formulierungsvorschlag** (ersetzt den Satz „Die Protokolle werden nach den Vorgaben der Plattform gelöscht …“):

> Die Protokolle werden in Google Cloud Logging gespeichert und nach 30 Tagen automatisch gelöscht [ggf. abweichende, eingestellte Frist]. Sie werden nicht mit anderen Daten zusammengeführt; eine Auswertung erfolgt nur anlassbezogen, etwa zur Aufklärung eines Angriffs.

## 2. Google als Auftragsverarbeiter (Abschnitt 2, ggf. eigener Absatz)

**Sachstand:** Für Google-Cloud-Kunden gilt das „Cloud Data Processing Addendum (Customers)“. Darin heißt es (Ziff. 4.1): „Google is a processor and Customer is a controller or processor, as applicable, of Customer Personal Data.“ Das Addendum wird Bestandteil des Vertrags mit Google ab dem Tag, an dem der Kunde es akzeptiert bzw. die Parteien es vereinbart haben; für Übermittlungen in Drittländer verweist es auf die EU-Standardvertragsklauseln (Anhang 3).
Quelle: Google Cloud, Cloud Data Processing Addendum (Customers), archivierte Fassung „Last modified: September 26, 2024“ – https://cloud.google.com/archive/terms/data-processing-addendum-20240926 (abgerufen 27.10.2026; die aktuelle Fassung ist dort verlinkt und vor Übernahme zu prüfen).

**Vor Übernahme zu klären:**
- Wer ist Vertragspartner von Google (THA-Rechnungskonto oder privates Konto)? Davon hängt ab, wer Verantwortlicher ist (Z11) und ob das Addendum für die THA gilt.
- Ist das Addendum in der Google-Cloud-Konsole (Konto → Datenschutz und Sicherheit) akzeptiert? Datum notieren.
- Gilt für die Gemini-API der bezahlte Tarif (Z12)? Erst dann entfällt der Hinweis zur Nutzung von Eingaben durch Google; beim kostenlosen Tarif ist Google insoweit nicht nur Auftragsverarbeiter.

**Formulierungsvorschlag:**

> Google verarbeitet die Protokoll- und Anfragedaten in unserem Auftrag als Auftragsverarbeiter (Art. 28 DSGVO). Grundlage ist das „Cloud Data Processing Addendum“ von Google in der jeweils geltenden Fassung, das wir am [Datum] angenommen haben. Für etwaige Übermittlungen in Drittländer gelten zusätzlich der Angemessenheitsbeschluss zum EU-US Data Privacy Framework bzw. die EU-Standardvertragsklauseln.

## 3. Bereits umgesetzt (ohne DSB-Vorbehalt, Gutachten 27.10.2026)

- Widerruf der Einwilligung (KI-Abschnitt): statt „durch Nichtnutzung beenden“ Widerruf jederzeit mit Wirkung für die Zukunft durch Entfernen des Häkchens oder formlose Mitteilung (Art. 7 Abs. 3 DSGVO) – wegen der Abschaltung der KI-Funktion derzeit nur im Reaktivierungstext (Abschnitt 4).
- Impressum: „Distanzierungs“-Floskel ersetzt durch knappe Linkhaftung nach §§ 7 ff. DDG.

## 4. Text für eine spätere Reaktivierung der KI-Funktion (Google Gemini)

Die KI-Funktion ist seit 27.10.2026 abgeschaltet (`src/data/kiSchalter.ts`, `KI_FUNKTION_AKTIV = false`; Server antwortet mit 503). Die Datenschutzerklärung nennt derzeit nur, dass keine Daten an Google Gemini übermittelt werden. Bei Reaktivierung (bezahlter Tarif empfohlen, Z12; DSB-Freigabe) diesen Abschnitt 3 wieder einsetzen – Widerruf bereits nach Art. 7 Abs. 3 DSGVO gefasst:

> **3. KI-Prompt-Generator (Google Gemini)**
>
> Im Modul „KI im Bauwesen“ können Sie einen Prompt an das Sprachmodell Google Gemini senden. Dies geschieht nur, wenn Sie den Hinweis zur Datenübermittlung bestätigen und die Analyse ausdrücklich starten. Übermittelt wird ausschließlich der Text des Prompts. Er geht über unseren Server an Google (Google Ireland Limited bzw. Google LLC, USA); Ihre IP-Adresse wird dabei nicht weitergegeben.
>
> Sofern ein kostenloser Tarif der Gemini-API genutzt wird, kann Google Eingaben und Ausgaben nach seinen Nutzungsbedingungen zur Verbesserung seiner Dienste verwenden und durch Menschen prüfen lassen. Geben Sie deshalb keine personenbezogenen, vertraulichen oder projektbezogenen Daten ein.
>
> Rechtsgrundlage ist Ihre Einwilligung (Art. 6 Abs. 1 lit. a DSGVO), die Sie mit dem Häkchen erteilen. Sie können sie jederzeit mit Wirkung für die Zukunft widerrufen, indem Sie das Häkchen entfernen oder uns dies formlos mitteilen (Kontakt siehe Impressum); die Rechtmäßigkeit der bis zum Widerruf erfolgten Verarbeitung bleibt unberührt (Art. 7 Abs. 3 DSGVO). Für Drittlandübermittlungen gilt der Angemessenheitsbeschluss zum EU-US Data Privacy Framework. Wir speichern die Prompts nicht. Die Antworten sind als KI-generiert gekennzeichnet (Art. 50 KI-Verordnung).

Bei bezahltem Tarif den zweiten Absatz durch den Hinweis auf die Auftragsverarbeitung (Abschnitt 2) ersetzen.
