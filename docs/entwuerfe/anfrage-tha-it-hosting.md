# Entwurf: Anfrage an das Rechenzentrum der THA – Hosting BaustoffBoard

Stand: 27.10.2026 · Entwurf zur Weiterleitung (Entscheidung 27.10.2026: „erst THA-IT fragen“, Cloud Run bleibt Rückfalloption)

---

**Betreff:** Anfrage Hosting einer Lehr-Webanwendung („BaustoffBoard“) im Rechenzentrum der THA

Sehr geehrte Damen und Herren,

für die Lehre in den Baustoff- und Bauingenieurfächern betreibe ich die interaktive Lernplattform
**BaustoffBoard** (derzeit unter www.baustoffboard.de). Ich möchte anfragen, ob die Anwendung künftig auf
Infrastruktur der THA betrieben werden kann. Damit wären Betreiberrolle, Datenschutz und Auftragsverarbeitung
in der Hochschule gebündelt.

**Technische Eckdaten**

| Punkt | Angabe |
|---|---|
| Art | Webanwendung: statisch vorgerenderte Seiten (rund 290) + kleiner Node.js-Server (Express) |
| Laufzeit | Node.js 22 LTS, ein Prozess; Container-Image (Dockerfile im Repository) oder direkt als Node-Dienst |
| Ressourcen | 1 vCPU, 512 MB–1 GB RAM genügen; Plattenbedarf < 200 MB |
| Port | frei wählbar (Umgebungsvariable `PORT`), Betrieb hinter Reverse Proxy mit TLS |
| Persistente Daten | eine kleine Datei für einen anonymen Kurzfragebogen (wenige MB/Jahr); keine Datenbank |
| Nutzerkonten | keine; nur ein Admin-Zugang (Kennwort als Umgebungsvariable/Secret) |
| Externe Dienste | optional eine KI-Schnittstelle (derzeit abgeschaltet); sonst keine |
| Protokolle | Webserver-Zugriffsprotokolle – Speicherdauer nach Vorgabe der THA bzw. des Datenschutzbeauftragten |
| Domain | Wunsch: Subdomain der THA (z. B. baustoffboard.tha.de) oder Weiterbetrieb von baustoffboard.de per DNS |
| Bereitstellung | Quellcode in einem GitHub-Repository; Aktualisierung per Pull/Container-Build, gern nach Ihrem Verfahren |
| Last | Lehrbetrieb, wenige hundert Nutzer pro Tag, Spitzen in Vorlesungen und vor Prüfungen |

**Fragen**

1. Ist ein Betrieb auf THA-Infrastruktur möglich (virtuelle Maschine, Container-Plattform oder Webhosting mit Node.js)?
2. Welche Domain-Lösung empfehlen Sie (Subdomain tha.de oder externe Domain)?
3. Wer übernimmt Updates des Betriebssystems bzw. der Plattform, und wie wird die Anwendung aktualisiert?
4. Gibt es Vorgaben zu Protokollierung, Speicherdauer und Datenschutz (Abstimmung mit dem Datenschutzbeauftragten)?
5. Wäre die THA in diesem Fall Diensteanbieterin im Sinne von Impressum und Datenschutzerklärung?

Eine Betriebsanleitung für die bisher geplante Variante (Google Cloud Run, Region Frankfurt) liegt vor und
kann als Grundlage dienen. Für Rückfragen stehe ich gern zur Verfügung.

Mit freundlichen Grüßen

[Name, Lehrgebiet, Fakultät]
