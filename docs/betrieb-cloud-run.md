# Betrieb auf Google Cloud Run (direkt aus GitHub)

Stand: 26.10.2026 · Gilt für Repository `juhu-tha/babo`, Branch `main`

Diese Anleitung beschreibt Schritt für Schritt, wie das BaustoffBoard künftig **ohne AI Studio** auf
Google Cloud Run läuft: Jeder Merge in `main` baut automatisch einen neuen Container (Cloud Build) und
stellt ihn als neue Revision bereit. Alle Schritte erfolgen in der Google Cloud Console
(<https://console.cloud.google.com>) mit der Maus; Befehle sind nicht nötig.

Was im Repository dafür vorbereitet ist:

| Datei | Zweck |
| --- | --- |
| `Dockerfile` | Bauanleitung des Containers: `npm run build`, danach schlankes Laufzeit-Image mit Node 22, Start mit `node dist/server.cjs` als Benutzer `node` (UID/GID 1000), Port aus der Umgebungsvariable `PORT` |
| `.dockerignore` | hält `node_modules`, `docs`, `tests`, `.env`-Dateien usw. aus dem Build heraus |
| `server.ts` | liest alle Einstellungen aus Umgebungsvariablen (siehe Schritt 5) |

> **Hinweis zu Geheimnissen:** In dieser Anleitung stehen bewusst keine Kennwörter oder Schlüssel.
> Diese gehören ausschließlich in den Secret Manager (Schritt 4) – nie in das Repository, nie in
> eine normale Umgebungsvariable und nie in E-Mails.

---

## Überblick in 12 Schritten

1. Projekt wählen, Abrechnung prüfen
2. Region festlegen (europe-west3 Frankfurt – mit Folge für die Domain, siehe Schritt 10)
3. Speicher-Bucket für den Kurzfragebogen anlegen
4. Geheimnisse im Secret Manager anlegen
5. Dienst mit dem GitHub-Repository verbinden (Cloud Build)
6. Umgebungsvariablen und Secrets eintragen
7. Volume einhängen
8. Skalierung: Mindestinstanzen 0, Höchstinstanzen 1 (Kosten)
9. Öffentlichen Zugriff erlauben und anlegen
10. Eigene Domain www.baustoffboard.de zuordnen
11. Prüfung nach dem Umzug
12. Rückweg: frühere Revision wiederherstellen

---

## 1. Projekt wählen, Abrechnung prüfen

1. Console öffnen, oben links in der Projektauswahl das Projekt wählen, in dem die App künftig laufen soll
   (es kann das bisherige AI-Studio-Projekt sein oder ein neues, z. B. „baustoffboard“).
2. Im Menü **Abrechnung** prüfen, dass dem Projekt ein Rechnungskonto zugeordnet ist (ohne Abrechnung
   lassen sich Cloud Build und Cloud Run nicht nutzen).
3. Für die eigene Person werden laut Google folgende Rollen gebraucht (als Projektinhaber sind sie
   enthalten): Artifact Registry Administrator, Cloud Build Editor, Cloud Run Developer,
   Service Account User, Service Usage Admin.

## 2. Region festlegen

Vorgabe: **europe-west3 (Frankfurt)**. Alle Ressourcen (Cloud Run, Bucket) in derselben Region anlegen.

**Wichtige Folge für die Domain:** Die einfache „Cloud Run Domain-Zuordnung“ ist laut Google in
europe-west3 **nicht verfügbar** (nur u. a. europe-north1, europe-west1, europe-west4) und außerdem
eine Vorschaufunktion, die Google ausdrücklich nicht für den Produktivbetrieb empfiehlt. In Frankfurt
wird die Domain daher über einen **Load Balancer** angebunden (Schritt 10, Variante A). Wer den Load
Balancer vermeiden will, muss eine andere Region wählen (z. B. europe-west1 Belgien oder europe-west4
Niederlande) und die Vorschaufunktion in Kauf nehmen (Variante B). → Entscheidung vor Schritt 5 treffen.

## 3. Speicher-Bucket für den Kurzfragebogen anlegen

Der Container selbst „vergisst“ alle Dateien bei jedem Neustart und bei jeder neuen Revision (Dateien
liegen nur im Arbeitsspeicher). Der Kurzfragebogen (Entscheidung Z43) schreibt seine Datei deshalb in
ein Verzeichnis, in das ein Cloud-Storage-Bucket eingehängt wird.

1. Menü **Cloud Storage → Buckets → Erstellen** (Create).
2. Name: weltweit eindeutig, z. B. `baustoffboard-laufzeitdaten` (ggf. mit Zusatz).
3. Speicherort: Standorttyp **Region**, Region **europe-west3 (Frankfurt)**.
4. Speicherklasse: **Standard**.
5. Zugriff: **Verhinderung des öffentlichen Zugriffs erzwingen** aktiviert lassen.
6. **Erstellen**.

## 4. Geheimnisse im Secret Manager anlegen

1. Menü **Security → Secret Manager** (ggf. zuerst die Secret Manager API aktivieren).
2. **Secret erstellen** (Create secret), Name `ADMIN_PASSWORD`, als Wert das Admin-Kennwort eintippen,
   **Secret erstellen**.
3. Ebenso `GEMINI_API_KEY` mit dem Gemini-API-Schlüssel anlegen.
4. Optional `POLL_ADMIN_PASSWORD` (eigenes Kennwort nur für die Live-Abstimmung; fehlt es, gilt
   `ADMIN_PASSWORD`).

**Berechtigung:** Das Dienstkonto, mit dem Cloud Run den Dienst ausführt (ohne eigene Auswahl das
„Compute Engine default service account“ `PROJEKTNUMMER-compute@developer.gserviceaccount.com`), braucht
die Rolle **Secret Manager Secret Accessor** und – für den Bucket – **Storage Object User**. Vergabe unter
**IAM & Verwaltung → IAM → Zugriff gewähren**. Google empfiehlt dafür ein eigenes, nur für diesen
Dienst angelegtes Dienstkonto mit genau diesen Rollen.

## 5. Dienst mit dem GitHub-Repository verbinden

Voraussetzung: Cloud Build API aktiviert (die Console bietet das beim ersten Mal an).

1. Menü **Cloud Run → Dienste** (Services).
2. **Mit Repository verbinden** (Connect repository).
3. **Cloud Build** auswählen.
4. Im Bereich **Mit Cloud Build einrichten**: Anbieter **GitHub**; falls nötig **Authentifizieren** und die
   GitHub-App „Google Cloud Build“ für das Repository `juhu-tha/babo` zulassen. Repository auswählen →
   **Weiter**.
5. **Build-Konfiguration**:
   - **Branch:** `^main$`
   - **Build-Typ:** **Dockerfile**, **Quellspeicherort:** `/Dockerfile`
6. **Speichern**. Das Formular lädt neu; danach im selben Formular die Schritte 6–9 ausfüllen.
7. Allgemeine Angaben: Dienstname z. B. `baustoffboard`, Region gemäß Schritt 2.

Ab jetzt baut Cloud Build bei jedem neuen Commit auf `main` (also bei jedem Merge eines PR) automatisch
ein neues Image und stellt es als neue Revision bereit. Den Verlauf zeigt der Link **Logs** auf der
Dienstseite; **Repository-Einstellungen bearbeiten** öffnet den Trigger in Cloud Build.

Tritt beim Verbinden mit GitHub ein Fehler „redirect_uri“ auf, empfiehlt Google: Verbindung auf der
Cloud-Build-Seite „Repositories“ zurücksetzen, Berechtigungen der GitHub-App prüfen, in einem privaten
Browserfenster erneut versuchen und prüfen, ob die GitHub-Organisation `juhu-tha` Apps von Dritten sperrt.

## 6. Umgebungsvariablen und Secrets eintragen

Im Formular **Container, Netzwerk, Sicherheit** aufklappen → Reiter **Container** → Abschnitt
**Variablen und Secrets**.

**Normale Variablen** (Schaltfläche **Variable hinzufügen**):

| Name | Wert | Bemerkung |
| --- | --- | --- |
| `GEMINI_DAILY_LIMIT` | `300` | KI-Anfragen pro Tag insgesamt |
| `ALLOWED_ORIGINS` | `https://www.baustoffboard.de,https://baustoffboard.de` | erlaubte Herkunft für KI-Anfragen und Kurzfragebogen |
| `FEEDBACK_DATEI` | `/app/laufzeitdaten/kurzfragebogen.json` | im Dockerfile bereits so voreingestellt; Eintrag macht es sichtbar |
| `GEMINI_MODEL` | *(nur bei Bedarf)* | optional; Standard steht in `server.ts` |

`PORT` **nicht** eintragen – Cloud Run setzt diese Variable selbst (reserviert); der Server liest sie.
`NODE_ENV=production` ist im Dockerfile gesetzt.

**Secrets** (Schaltfläche **Secret referenzieren**), je Zeile Name = Name der Umgebungsvariable:

| Name (Umgebungsvariable) | Secret | Version |
| --- | --- | --- |
| `ADMIN_PASSWORD` | `ADMIN_PASSWORD` | feste Versionsnummer, z. B. `1` |
| `GEMINI_API_KEY` | `GEMINI_API_KEY` | feste Versionsnummer |
| `POLL_ADMIN_PASSWORD` | `POLL_ADMIN_PASSWORD` | optional |

Google empfiehlt bei Umgebungsvariablen eine **feste Version** statt „latest“, weil der Wert nur beim
Start einer Instanz gelesen wird. Wird ein Kennwort geändert: neue Secret-Version anlegen, hier die
Versionsnummer anpassen und neu bereitstellen.

## 7. Volume einhängen (Kurzfragebogen dauerhaft speichern)

1. Reiter **Volumes** → **Volume hinzufügen**: Typ **Cloud Storage-Bucket**, Name z. B. `laufzeitdaten`,
   Bucket aus Schritt 3 wählen, **nicht** schreibgeschützt.
2. Unter **Bereitstellungsoptionen** (Mount options) eintragen: `uid=1000` und `gid=1000`.
   Grund: Volumes gehören standardmäßig „root“; der Container läuft aus Sicherheitsgründen als Benutzer
   `node` (UID/GID 1000) und könnte sonst nicht schreiben.
3. Reiter **Container** → **Volume-Bereitstellungen** → **Volume bereitstellen**: Volume `laufzeitdaten`,
   Bereitstellungspfad **`/app/laufzeitdaten`**.
4. Ausführungsumgebung: Volumes brauchen die **2. Generation**; Cloud Run wählt sie automatisch, wenn
   nichts anderes eingestellt ist.

Der Server legt die Datei beim ersten Speichern selbst an (Verzeichnis wird bei Bedarf erzeugt,
geschrieben wird über eine temporäre Datei mit anschließendem Umbenennen). Ein anderer Pfad lässt sich
über `FEEDBACK_DATEI` einstellen – dann den Bereitstellungspfad entsprechend wählen.

Zu wissen (Google-Dokumentation): Cloud Storage FUSE hat keine Dateisperren; schreiben **mehrere
Instanzen** gleichzeitig in dieselbe Datei, gewinnt der letzte Schreibvorgang und frühere gehen verloren.
Deshalb in Schritt 8 höchstens **eine** Instanz zulassen. Kann das Volume beim Start nicht innerhalb von
30 Sekunden eingehängt werden, startet der Dienst nicht (dann Bucket-Name und Rolle aus Schritt 4 prüfen).

Hinweis: Der Besuchszähler (`analytics.json`) liegt weiterhin nur im Container und beginnt nach jedem
Neustart bei 0 (unverändert gegenüber heute).

## 8. Skalierung und Kosten

Reiter **Skalierung** (bzw. Abschnitt **Dienstskalierung**):

- **Mindestanzahl Instanzen: 0** – ohne Besucher läuft kein Container; bei anfragebasierter
  Abrechnung (request-based billing) entstehen dann für Cloud Run keine Kosten. Nachteil: Der erste
  Aufruf nach einer Pause dauert einige Sekunden länger (Kaltstart). Ein Wert > 0 hält Instanzen
  dauerhaft bereit und wird auch ohne Besucher berechnet.
- **Höchstanzahl Instanzen: 1** – empfohlen, weil Kurzfragebogen-Datei, Live-Abstimmung,
  Anfragebegrenzung und das Tageslimit der KI je Instanz geführt werden. Für eine Lehrplattform reicht
  eine Instanz in aller Regel aus.

Kostenrahmen laut Google-Preisliste (Stand Abruf 26.10.2026): Cloud Run hat je Rechnungskonto und Monat
ein kostenloses Kontingent (180 000 vCPU-Sekunden, 360 000 GiB-Sekunden, 2 Mio. Anfragen);
europe-west3 gehört zur Preisstufe „Tier 2“. Dazu kommen kleine Beträge für Cloud Build, Artifact
Registry (gespeicherte Images) und Cloud Storage. Der **Load Balancer** aus Schritt 10 A kostet
zusätzlich unabhängig vom Verkehr 0,025 USD je Stunde für die Weiterleitungsregel (rund 18 USD im
Monat) plus 0,008 USD je verarbeitetem GiB. Empfehlung: unter **Abrechnung → Budgets und Benachrichtigungen**
ein Budget mit E-Mail-Warnung anlegen.

## 9. Öffentlichen Zugriff erlauben und anlegen

1. Abschnitt **Authentifizierung**: **Öffentlichen Zugriff zulassen** wählen (die Website ist öffentlich;
   der Admin-Bereich ist durch `ADMIN_PASSWORD` geschützt).
2. **Erstellen**. Der erste Build läuft sofort los (einige Minuten); den Fortschritt zeigt die Dienstseite.
3. Danach steht oben auf der Dienstseite die Adresse `https://baustoffboard-….run.app`. Damit zuerst
   testen (Schritt 11), **bevor** die Domain umgestellt wird.

Spätere Änderungen an einem bestehenden Dienst: Dienst anklicken → **Neue Überarbeitung bearbeiten und
bereitstellen** bzw. im jeweiligen Reiter ändern → **Unterschiede ansehen und neu bereitstellen** →
**Änderungen bereitstellen**.

## 10. Eigene Domain www.baustoffboard.de zuordnen

Vorher: Beim Domainanbieter die heutige **Weiterleitung (Permalink auf AI Studio) entfernen**, sonst
greifen die neuen DNS-Einträge nicht. Ausfallzeit einplanen (Zertifikat: meist Minuten, im Einzelfall
bis zu 24 Stunden) – z. B. in der vorlesungsfreien Zeit oder am Wochenende.

### Variante A (Region Frankfurt, von Google empfohlen): Load Balancer

1. **VPC-Netzwerk → IP-Adressen → Externe statische IP-Adresse reservieren**: Netzwerkdienststufe
   Premium, IPv4, Typ **Global**, Name z. B. `baustoffboard-ip`.
2. **Netzwerkdienste → Load Balancing → Load Balancer erstellen**: **Application Load Balancer
   (HTTP/HTTPS)** → **Öffentlich (extern)** → **Am besten für globale Arbeitslasten** →
   **Globaler externer Application Load Balancer**.
3. **Frontend**: Protokoll **HTTPS**, IP-Adresse aus 1., Port 443; **Zertifikat → Neues Zertifikat
   erstellen → Von Google verwaltetes Zertifikat**, Domains `www.baustoffboard.de` und
   `baustoffboard.de`. Optional „HTTP-zu-HTTPS-Weiterleitung aktivieren“.
4. **Backend**: Backend-Dienst erstellen, Typ **Serverlose Netzwerk-Endpunktgruppe** → neue Gruppe in
   Region **europe-west3**, **Cloud Run**, Dienst `baustoffboard`.
5. **Routingregeln**: Standard lassen. **Erstellen**.
6. **DNS beim Domainanbieter**: zwei **A-Einträge** auf die IP-Adresse aus 1. – Host `@` (für
   baustoffboard.de) und Host `www`.
7. Warten, bis das Zertifikat den Status **ACTIVE** hat (es wird erst ausgestellt, wenn das DNS auf den
   Load Balancer zeigt).
8. Danach im Cloud-Run-Dienst, Reiter **Netzwerk**, den Eingang (Ingress) auf **Intern und Cloud Load
   Balancing** stellen, damit niemand den Load Balancer über die `run.app`-Adresse umgeht.

### Variante B (nur bei anderer Region, z. B. europe-west1): Cloud Run Domain-Zuordnung (Vorschau)

1. **Cloud Run → Domainzuordnungen → Zuordnung hinzufügen** (ggf. über das Drei-Punkte-Menü).
2. Dienst wählen → **Cloud Run Domain Mappings** → **Neue Domain bestätigen**, Basisdomain
   `baustoffboard.de` eingeben. Die Inhaberschaft wird über die Google Search Console bestätigt
   (einmalig; nur die bestätigende Person darf danach Zuordnungen anlegen).
3. Für `www.baustoffboard.de` und ggf. `baustoffboard.de` die angezeigten **DNS-Einträge** (A/AAAA bzw.
   CNAME, wie von Cloud Run vorgegeben) beim Domainanbieter eintragen: Host `www` bzw. `@`.
4. Enthält die Domain CAA-Einträge, müssen `pki.goog` und `letsencrypt.org` erlaubt sein.

Google nennt als dritte Möglichkeit Firebase Hosting (eigene Nutzungsbedingungen, nicht Teil der
Google-Cloud-Bedingungen); hier nicht weiter beschrieben.

## 11. Prüfung nach dem Umzug

Zuerst mit der `run.app`-Adresse, nach der Domainumstellung mit www.baustoffboard.de:

1. `https://www.baustoffboard.de/api/health` im Browser öffnen. Erwartet:
   `{"status":"ok","version":"…","uptime":…}` – die Version entspricht der in `package.json`.
2. Startseite und zwei, drei Module öffnen; ein Rechner, eine Formel (KaTeX), ein Diagramm.
3. Admin-Bereich: Anmeldung mit dem Kennwort aus dem Secret Manager funktioniert.
4. Kurzfragebogen einmal absenden, dann in **Cloud Storage → Bucket** prüfen, dass
   `kurzfragebogen.json` erscheint. Im Admin-Bereich die Auswertung ansehen.
5. KI-Analyse einmal auslösen (prüft `GEMINI_API_KEY` und `ALLOWED_ORIGINS`). Meldung „Anfragen sind
   nur aus dem BaustoffBoard möglich“ → `ALLOWED_ORIGINS` prüfen.
6. `http://baustoffboard.de` (ohne www, ohne https) aufrufen und prüfen, dass die Seite erreichbar ist.
7. Bei Fehlern: Dienstseite → Reiter **Logs** (Startmeldung „Server running on …“, Fehlermeldungen).

## 12. Rückweg: frühere Revision wiederherstellen

Jede Bereitstellung erzeugt eine Revision; alte Revisionen bleiben erhalten.

1. **Cloud Run → Dienste →** `baustoffboard` → Reiter **Überarbeitungen** (Revision history).
2. Bei der funktionierenden älteren Revision das Drei-Punkte-Menü → **Traffic verwalten**.
3. **Gesamten Traffic an eine Überarbeitung senden** → Revision auswählen → **Speichern**.
   Die Umstellung wirkt sofort (Google prüft dabei nichts erneut).
4. Wichtig: Solange der Traffic auf eine ältere Revision zeigt, bleibt das so – auch wenn neue Merges
   neue Revisionen bauen. Nach der Fehlerbehebung wieder **Gesamten Traffic an die neueste Überarbeitung
   senden** wählen.

Notfall-Rückweg zur bisherigen Lösung: beim Domainanbieter die alte Weiterleitung auf die
AI-Studio-App wieder eintragen (die AI-Studio-App bleibt bis zur endgültigen Abschaltung bestehen).

---

## Quellen (offizielle Google-Cloud-Dokumentation, abgerufen am 26.10.2026)

- Kontinuierliche Bereitstellung aus Git: <https://docs.cloud.google.com/run/docs/continuous-deployment>
- Cloud-Storage-Volumes für Cloud-Run-Dienste: <https://docs.cloud.google.com/run/docs/configuring/services/cloud-storage-volume-mounts?hl=en>
- Secrets für Dienste: <https://docs.cloud.google.com/run/docs/configuring/secrets>
- Secret erstellen (Secret Manager): <https://docs.cloud.google.com/secret-manager/docs/creating-and-accessing-secrets?authuser=2>
- Umgebungsvariablen: <https://docs.cloud.google.com/run/docs/configuring/environment-variables>
- Container-Laufzeitvertrag (PORT, Dateisystem im Arbeitsspeicher): <https://docs.cloud.google.com/run/docs/container-contract>
- Mindestinstanzen: <https://docs.cloud.google.com/run/docs/configuring/min-instance>
- Höchstinstanzen: <https://docs.cloud.google.com/run/docs/configuring/max-instances>
- Öffentlicher Zugriff: <https://docs.cloud.google.com/run/docs/authenticating/public>
- Dienstidentität: <https://docs.cloud.google.com/run/docs/securing/service-identity>
- Eigene Domains (Optionen, Regionen der Domain-Zuordnung): <https://docs.cloud.google.com/run/docs/mapping-custom-domains>
- Load Balancer mit Cloud Run: <https://docs.cloud.google.com/run/docs/integrate/custom-domain-load-balancer>
- Rollback und Traffic: <https://docs.cloud.google.com/run/docs/rollouts-rollbacks-traffic-migration>
- Bucket erstellen: <https://docs.cloud.google.com/storage/docs/creating-buckets>
- Preise Cloud Run: <https://cloud.google.com/run/pricing?authuser=5>
- Preise Cloud Load Balancing: <https://cloud.google.com/load-balancing/pricing?authuser=0>

Die Bezeichnungen der Schaltflächen sind sinngemäß aus der englischen Dokumentation übertragen; in der
deutschsprachigen Console können sie leicht abweichen.
