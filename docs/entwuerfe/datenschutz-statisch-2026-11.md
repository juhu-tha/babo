# Datenschutzerklärung für den statischen Betrieb auf Vercel (Entwurf, 02.11.2026)

> **ENTWURF ZUR ABSTIMMUNG MIT DEM DATENSCHUTZBEAUFTRAGTEN (DSB) DER THA – KEINE RECHTSBERATUNG.**
> Dieser Text ist eine technische Bestandsaufnahme mit Formulierungsvorschlägen. Rechtliche Bewertungen
> (Rechtsgrundlagen, Drittlandübermittlung, Auftragsverarbeitung) sind vom DSB zu prüfen und zu bestätigen.
> **In der App ist nichts geändert:** `src/modules/Datenschutz.tsx` und `src/data/speicherRegister.ts`
> zeigen weiterhin die Fassung für den Betrieb mit eigenem Server (Stand Oktober 2026).
> Platzhalter stehen in [eckigen Klammern].

Anlass: Die Seite läuft seit 02.11.2026 auf Vercel rein statisch (PR #294, `vercel.json`, Schalter
`BB_STATISCH=1` → `STATISCH` in `src/data/betriebsart.ts`; Betrieb: `docs/betrieb-vercel.md`). Die heutige
Datenschutzerklärung beschreibt Google Cloud Run als Hoster, Server-Funktionen (Besuchszähler,
Anfragebegrenzung, Kurzfragebogen, Live-Abstimmung) und das Plattform-Cookie `GAESA`. Auf Vercel gibt es
diese Server-Funktionen nicht; Vercel als Hoster fehlt.

Geltungsbereich: Diese Fassung gilt nur für die statisch ausgelieferte Fassung (Vercel). Für den Betrieb mit
eigenem Server (`npm start`, `Dockerfile`, Cloud Run) bleibt die heutige Fassung samt den offenen Punkten aus
`docs/entwuerfe/datenschutz-ergaenzungen.md` maßgeblich.

---

## A. Inventar: Was fällt im statischen Betrieb tatsächlich an? (belegt am Code und an der Live-Seite)

Prüfstand: Branch `origin/main` nach #297; Live-Seite https://babo-zeta.vercel.app/ am 02.11.2026 nur lesend
abgerufen (`curl`, Startseite, `/modul/datenschutz`, `/api/health`).

### A.1 Hosting und Protokolle (Vercel)

| Befund | Beleg |
|---|---|
| Hoster ist Vercel (Vercel Inc., USA) | Antwortheader `server: Vercel`, `x-vercel-id: iad1::…`, `x-vercel-cache: MISS` |
| Kein Server-Code im Betrieb, alle `/api`-Adressen fehlen | `GET /api/health` → 404; `vercel.json` `buildCommand` entfernt `dist/server.cjs` |
| Region im Header: `iad1` (Washington, D.C., USA) | `x-vercel-id` beginnt mit `iad1`. Laut Vercel-Dokumentation nennt dieses Feld „the edge region where the request was processed“ – also den Knoten, der die Anfrage bedient hat. Die Prüfumgebung lag in den USA; welcher Knoten Aufrufe aus Deutschland bedient (vermutlich ein europäischer, z. B. `fra1`), ist **nicht belegt** → offener Punkt D.3. Die Konfiguration der Vercel-Projektregion ist für rein statische Dateien nicht maßgeblich. |
| Vercel erfasst je Anfrage technische Daten (u. a. Zeit, Methode, Pfad, Suchparameter, Statuscode, User-Agent, Region, Cache-Status); die Filterfunktion „Logs from your browser“ arbeitet mit **IP-Adresse und User-Agent** | Vercel-Dokumentation „Runtime Logs“ (Abschnitte „Log details“, „Logs from your browser“) |
| Für Kunden sichtbare Protokolle: Hobby 1 Stunde, Pro 1 Tag, Pro mit Observability Plus 30 Tage, Enterprise 3 Tage; statische Anfragen erscheinen dort nur, soweit sie aus dem Cache bedient werden | Vercel „Runtime Logs“, Abschnitt „Limits“ und Tabelle „Available log types“ (Stand der Seite 28.08.2026) |
| Wie lange Vercel selbst Zugriffsdaten (IP-Adressen) speichert, ist damit **nicht** gesagt; das Data Processing Addendum behandelt „Service-Generated Data“ als Daten, für die Vercel **Verantwortlicher** ist | Vercel DPA, Fassung „Last Updated March 17, 2026“, gültig ab 31.03.2026 → offener Punkt D.2 |
| Keine Log Drains, keine Vercel Web Analytics, keine Speed Insights | Code: keine Abhängigkeit `@vercel/*` in `package.json`, kein Aufruf `/_vercel/insights` in `src/`, `index.html`; Log Drains wären eine Projekteinstellung → in Vercel zu bestätigen (D.4) |

### A.2 Cookies

| Cookie | Statisch gesetzt? | Beleg |
|---|---|---|
| (Plattform) | **nein** – keine `Set-Cookie`-Antwort | Header von `/` und `/modul/datenschutz` ohne `set-cookie` |
| `GAESA` (Google-Plattform, heute in Abschnitt 6 genannt) | **nein** – gehört zu Google Cloud Run | wie oben |
| `bb_voter` (Live-Abstimmung) | **nein** – setzt nur `server.ts`, Abstimmung ist statisch ausgeblendet | `src/modules/Vorlesungen.tsx` Z. 336 (`SERVER_FUNKTIONEN &&`) |
| `googtrans` | **ja, aber nur nach Aktivieren der Übersetzung** | `src/contexts/LanguageContext.tsx` Z. 98–99 (setzen), 127–128 (löschen) |

### A.3 Speicher im Browser (localStorage/sessionStorage)

Alle im Code verwendeten Schlüssel stehen in `src/data/speicherRegister.ts` (25 Einträge;
`npx tsx tests/speicherRegister.test.ts` → „alle verwendeten Schlüssel registriert“, Stand 02.11.2026).
Zusätzlich per Grep über `src/` gegengeprüft. Im statischen Betrieb gilt:

| Schlüssel | Ort | statisch genutzt? |
|---|---|---|
| `theme`, `baustoffboard_lang`, `th_bauboard_a11y_prefs`, `baustoffboard_screen_width`, `baustoffboard_fluid_width`, `baustoffboard_tooltip_mode`, `baustoffboard_derivation_mode`, `baustoffboard_favorites`, `baustoffboard_recent`, `dauerhaftigkeit_subtab` | localStorage | ja (Bedienung) |
| `tha_study_phase`, `tha_bookmarked_tabs`, `tha_bloom_completed`, `tha_klausur_history`, `tha_quiz_session_history`, `tha_quiz_active_gaps`, `bb_labor_protokolle`, `tha_lab_protocols_history`, `bau_bautagebuch_diaries` | localStorage | ja (Lernen, eigene Einträge) |
| `bb_kurzfragebogen` | localStorage | **nein** – Kurzfragebogen wird statisch nicht eingeblendet (`src/App.tsx` Z. 681) |
| `bb_quiz_freigabe` | localStorage | **nein** – nur im Administrationsbereich hinter der Anmeldung, die statisch fehlt (`src/modules/Admin.tsx` Z. 205/235) |
| `bb_admin_token` | sessionStorage | **nein** – Anmeldung statisch nicht verfügbar |
| `tha_admin_authenticated` | sessionStorage | **nein** – wird nur entfernt (`src/utils/adminAuth.ts` Z. 22), nie gesetzt |

Hinweis für die Umsetzung: Die Tabelle in der Erklärung wird aus dem Register erzeugt. Im Statik-Modus sollten
die fünf mit „nein“ markierten Einträge (einschließlich `bb_voter`) ausgeblendet werden (siehe F).
Kein IndexedDB, kein Service Worker, keine Cache-API (Grep über `src/` ohne Treffer).

### A.4 Externe Abrufe

| Art | Befund | Beleg |
|---|---|---|
| Schriften | **lokal**: Inter wird als FontFace aus dem eigenen Bundle geladen (Base64), keine Google Fonts, kein Schrift-CDN | `src/lib/schriften.ts`; CSP `font-src 'self' data:` |
| Skripte/Styles von Dritten | **keine beim Seitenaufruf**; einzig das Google-Translate-Skript, und nur nach Aktivieren der Übersetzung | `src/contexts/LanguageContext.tsx` Z. 102–112; Startseite enthält nur eigene Skripte (`/boot/…`, `/assets/…`) |
| Datenabrufe | nur eigene Adresse (`/suchindex.json`, `/audit-bundle.json` im Admin-Bereich); alle `/api`-Aufrufe stehen hinter `SERVER_FUNKTIONEN` | Grep `fetch(` in `src/`; `tests/statikModus.test.ts` |
| Eingebettete Videos | **keine** – YouTube erscheint nur als normaler Link (Aufruf erst nach Klick, auf der YouTube-Seite) | kein `<iframe>` in `src/`; `src/modules/ki/KiOnlinekurse.tsx`, `src/components/ui/OerEncyclopedia.tsx` nur `url:` |
| Eingebettete Karten | **keine** | Grep ohne Treffer (maps.google, openstreetmap) |
| Externe Bilder | **keine** im Code gefunden; QR-Codes werden lokal erzeugt (Paket `qrcode`), und die Abstimmung ist statisch ohnehin aus | Grep `<img`; `src/components/polls/LecturePollSession.tsx` Z. 3 |
| Einbettung der Seite | Einbettung über baustoffboard.de erlaubt (`frame-ancestors`) | `vercel.json`, CSP |

Nebenbefund (nur zur Kenntnis, keine Datenverarbeitung): Die CSP erlaubt `frame-src` für
`youtube-nocookie.com`/`youtube.com` und `img-src https:`, obwohl derzeit nichts eingebettet wird. Wird später ein
Video eingebettet, ist die Erklärung zu ergänzen (Zwei-Klick-Lösung empfehlenswert, vom DSB zu entscheiden).

### A.5 Nicht mehr vorhanden (statisch)

Besuchszähler (`/api/analytics/visit`), Anfragebegrenzung je IP im Arbeitsspeicher, Kurzfragebogen
(`/api/feedback`), Live-Abstimmung (`/api/polls…`), Admin-Anmeldung (`/api/admin…`), KI-Analyse
(`/api/gemini/analyze`, ohnehin abgeschaltet). Beleg: `src/data/betriebsart.ts`, `docs/betrieb-vercel.md`.

---

## B. Änderungen gegenüber der heutigen Fassung (Abschnitt für Abschnitt)

Kennzeichnung: **[UNVERÄNDERT]**, **[ÄNDERN]**, **[STREICHEN]**, **[NEU]**.

| Nr. heute | Abschnitt | Kennzeichnung | Kurzbegründung |
|---|---|---|---|
| 1 | Verantwortliche Stelle und DSB | **[UNVERÄNDERT]** – vorbehaltlich D.1 | Wer den Vercel-Vertrag hält, kann die Verantwortlichkeit berühren |
| 2 | Hosting und Server-Protokolle | **[ÄNDERN]** | Google Cloud Run → Vercel; Absatz „Anfragebegrenzung/Besuchszähler“ **[STREICHEN]**; Speicherdauer und Auftragsverarbeitung als Platzhalter **[NEU]** |
| 3 | KI-Prompt-Generator | **[ÄNDERN]** (kürzen) | „unser Server nimmt keine KI-Anfragen an“ → es gibt keinen Server; Prompt-Generator im Browser bleibt |
| 4 | Live-Abstimmungen | **[STREICHEN]** | Funktion statisch ausgeblendet, Cookie `bb_voter` entfällt |
| 5 | Anonymer Kurzfragebogen | **[STREICHEN]** | Funktion statisch nicht eingeblendet, Schlüssel `bb_kurzfragebogen` entfällt |
| 6 | Cookies und Übersetzung | **[ÄNDERN]** | Satz zu `GAESA` **[STREICHEN]**; „keine Cookies beim Aufruf“ **[NEU]**; Google Translate **[UNVERÄNDERT]** |
| 7 | Berechnungen im Browser | **[ÄNDERN]** | Verweis „Ausnahmen 3. bis 5.“ entfällt – statisch gibt es keine Übertragung von Eingaben |
| 8 | Speicherung im Browser | **[ÄNDERN]** | Tabelle ohne die statisch ungenutzten Einträge (A.3) |
| – | Externe Links (YouTube u. a.) | **[NEU]**, optional | kurzer Hinweis, dass verlinkte Seiten erst nach Klick aufgerufen werden |
| 9 | Kontakt per E-Mail | **[UNVERÄNDERT]** | |
| 10 | Ihre Rechte | **[UNVERÄNDERT]** – Prüfauftrag D.8 | ggf. Art. 77 DSGVO/Beschwerderecht ist in 11 |
| 11 | Beschwerderecht | **[UNVERÄNDERT]** | |
| Kopf | „Stand: Oktober 2026“ | **[ÄNDERN]** | „Stand: [Monat 2026]“ nach Freigabe |

Nummerierung: Durch das Streichen von 4 und 5 rücken die folgenden Abschnitte nach (Fassung C nummeriert neu).

---

## C. Fassung für den statischen Betrieb (Formulierungsvorschlag)

Änderungen gegenüber heute sind mit ⟨NEU⟩ / ⟨GEÄNDERT⟩ markiert; gestrichene Passagen stehen am Ende des
jeweiligen Abschnitts als ~~durchgestrichen~~ zur Kontrolle.

**Datenschutzerklärung** · Stand: [Monat] 2026

### 1. Verantwortliche Stelle und Datenschutzbeauftragter
[UNVERÄNDERT gegenüber heute – vorbehaltlich D.1]

### 2. Bereitstellung (Hosting) und Zugriffsprotokolle ⟨GEÄNDERT⟩

> ⟨NEU⟩ Die Anwendung wird als statische Website über die Plattform der Vercel Inc., [Anschrift laut Vertrag bzw.
> Datenschutzhinweis von Vercel], USA, bereitgestellt. Auf dieser Plattform läuft kein eigener Server der
> Anwendung; ausgeliefert werden nur fertige Dateien (Seiten, Skripte, Grafiken). Vercel liefert die Dateien über
> ein weltweites Netz von Rechenzentren aus; die Anfrage beantwortet in der Regel ein Rechenzentrum in der Nähe
> des aufrufenden Geräts [bei Bestätigung D.3: „für Aufrufe aus Europa in der Regel in der EU“]. Eine
> Verarbeitung in den USA ist nicht auszuschließen. Vercel Inc. ist nach dem EU-US Data Privacy Framework
> zertifiziert; dafür besteht ein Angemessenheitsbeschluss der Europäischen Kommission (Art. 45 DSGVO).
> [bei Bestätigung D.2: „Ergänzend gelten die EU-Standardvertragsklauseln aus dem Auftragsverarbeitungsvertrag.“]

> Beim Aufruf erfasst die Plattform automatisch technische Zugriffsdaten:
> - IP-Adresse des aufrufenden Geräts
> - Datum und Uhrzeit des Abrufs
> - aufgerufene Adresse und Statuscode
> - übertragene Datenmenge
> - Browser und Betriebssystem (User-Agent)

> Zweck ist die Auslieferung der Seiten und ein sicherer, stabiler Betrieb, etwa die Abwehr von Angriffen.
> Rechtsgrundlage ist Art. 6 Abs. 1 lit. e DSGVO i. V. m. Art. 4 BayDSG. ⟨NEU⟩ Vercel verarbeitet diese Daten
> [in unserem Auftrag als Auftragsverarbeiter (Art. 28 DSGVO) auf Grundlage des Data Processing Addendum von
> Vercel, angenommen am [Datum]] [Formulierung je nach Ergebnis D.2]. Die für uns einsehbaren Protokolle werden
> nach [1 Stunde / 1 Tag – je nach Tarif, D.2/D.5] gelöscht; [Angabe zur Speicherdauer bei Vercel selbst, D.2].
> Die Daten werden nicht mit anderen Daten zusammengeführt. ⟨NEU⟩ Die Anwendung selbst setzt keine
> Zugriffszähler ein und wertet keine Zugriffe aus.

~~Die Anwendung wird über Google AI Studio auf der Container-Plattform Google Cloud Run bereitgestellt (Google
Ireland Limited … bzw. Google LLC, USA). … Google LLC ist nach dem EU-US Data Privacy Framework zertifiziert …~~
~~Die Protokolle werden nach den Vorgaben der Plattform gelöscht …~~
~~Zum Schutz vor Missbrauch zählt der Server Anfragen je IP-Adresse für höchstens eine Stunde im Arbeitsspeicher
(Anfragebegrenzung). … Der Besuchszähler erfasst nur die Anzahl der Seitenaufrufe, ohne Bezug zu einer Person.~~

### 3. KI-Prompt-Generator ⟨GEÄNDERT⟩

> Die Anbindung an ein Sprachmodell ist in dieser Fassung nicht vorhanden; es werden keine Daten an KI-Dienste
> übermittelt. Der Prompt-Generator im Modul „KI im Bauwesen“ arbeitet vollständig in Ihrem Browser. Wenn Sie
> einen kopierten Prompt in einem KI-Dienst Ihrer Wahl verwenden, gelten dafür dessen Datenschutzbestimmungen.

~~Die KI-Funktion (Anbindung an das Sprachmodell Google Gemini) ist derzeit abgeschaltet. Es werden keine Daten an
Google Gemini übermittelt; unser Server nimmt keine KI-Anfragen an.~~

### ~~4. Live-Abstimmungen in Lehrveranstaltungen~~ [STREICHEN]
Begründung: statisch ausgeblendet (`src/modules/Vorlesungen.tsx`), kein Cookie `bb_voter`.

### ~~5. Anonymer Kurzfragebogen~~ [STREICHEN]
Begründung: statisch nicht eingeblendet (`src/App.tsx`), kein Schlüssel `bb_kurzfragebogen`, kein `/api/feedback`.

### 4. Cookies und Übersetzung ⟨GEÄNDERT, bisher 6.⟩

> Beim Aufruf der Anwendung werden ⟨NEU⟩ **keine Cookies gesetzt** – weder von der Anwendung noch von der
> Plattform. Die Anwendung bindet keine Analyse-, Tracking- oder Marketingdienste ein.

> **Optionale Übersetzung (Google Translate):** Erst wenn Sie die Übersetzung aktivieren, wird das Cookie
> `googtrans` gesetzt und das Skript des Übersetzungsdienstes von Google LLC (USA) geladen. Dabei werden Ihre
> IP-Adresse und die Seiteninhalte an Google übertragen. Rechtsgrundlage ist Ihre Einwilligung durch das
> Aktivieren (Art. 6 Abs. 1 lit. a DSGVO, § 25 Abs. 1 TDDDG). [UNVERÄNDERT; Prüfauftrag D.7]

~~Die Plattform setzt ein technisches Cookie für die Lastverteilung (`GAESA`), das keine Nutzerprofile speichert.~~

### 5. Berechnungen im Browser ⟨GEÄNDERT, bisher 7.⟩

> Alle Berechnungen, zum Beispiel Mischungsberechnungen, U-Wert- und Glaser-Nachweise oder Bemessungen, laufen
> ausschließlich in Ihrem Browser. Eingaben in Rechnern und Formularen werden nicht übertragen.

~~Ausnahmen sind nur die unter 3. bis 5. beschriebenen Funktionen.~~

### 6. Speicherung im Browser ⟨GEÄNDERT, bisher 8.⟩

> [Einleitungstext UNVERÄNDERT.] Tabelle wie heute, jedoch **ohne** die Einträge `bb_kurzfragebogen`,
> `bb_quiz_freigabe`, `bb_admin_token`, `tha_admin_authenticated` und `bb_voter` (im statischen Betrieb nie
> gesetzt, A.2/A.3). `googtrans` bleibt.

### 7. Links zu anderen Websites ⟨NEU, optional⟩

> Die Anwendung verweist auf Seiten Dritter (z. B. Normungsorganisationen, Lernvideos auf YouTube). Diese Seiten
> werden erst aufgerufen, wenn Sie den Link anklicken; vorher werden keine Daten an deren Anbieter übertragen.
> Für die verlinkten Seiten gelten die Datenschutzbestimmungen ihrer Anbieter.

### 8. Kontakt per E-Mail · 9. Ihre Rechte · 10. Beschwerderecht
[UNVERÄNDERT gegenüber heute (bisher 9.–11.)]

---

## D. Offene Punkte für den DSB (Entscheidungs- und Klärungsliste)

1. **Vertragspartner und Verantwortlicher:** Wer hält das Vercel-Konto/-Team, über das babo-zeta.vercel.app
   betrieben wird – THA oder ein privates Konto? Davon hängt ab, ob die THA Verantwortliche bleibt und wer den
   Auftragsverarbeitungsvertrag schließt (gleiche Frage wie bei Google, Z11). [Kontoinhaber: …]
2. **Auftragsverarbeitungsvertrag (Art. 28 DSGVO) mit Vercel:** Das Vercel Data Processing Addendum (Fassung
   „Last Updated March 17, 2026“, wirksam ab 31.03.2026) nennt als Geltungsbereich Kunden in den Tarifen **Pro und
   Enterprise**; der Tarif **Hobby** wird dort nicht genannt. Zu klären: (a) Welcher Tarif ist gebucht? (b) Ist
   das DPA für dieses Konto wirksam (Datum)? (c) Das DPA stuft „Service-Generated Data“ als Daten ein, für die
   **Vercel Verantwortlicher** ist – fallen Zugriffsdaten der Besucher (IP-Adresse) darunter? Wenn ja: wie ist das
   in der Erklärung darzustellen (eigene Verantwortlichkeit von Vercel statt Auftragsverarbeitung)?
   (d) Unterauftragsverarbeiter-Liste (security.vercel.com) zur Kenntnis nehmen.
3. **Region:** Im Header der Prüfabrufe stand `iad1` (USA); die Prüfumgebung lag in den USA. Bitte mit einem
   Abruf aus dem THA-Netz prüfen, welche Region `x-vercel-id` dort nennt (Vorschlag: `curl -sI
   https://babo-zeta.vercel.app/ | grep x-vercel-id`). Ob eine Beschränkung auf EU-Rechenzentren für statische
   Auslieferung überhaupt möglich ist, ist nicht geklärt.
4. **Log Drains/Analysen:** In den Vercel-Projekteinstellungen bestätigen, dass keine Log Drains, keine Web
   Analytics und keine Speed Insights aktiv sind (im Code ist nichts davon eingebunden).
5. **Speicherdauer der Protokolle:** Kundensicht laut Vercel-Dokumentation: Hobby 1 Stunde, Pro 1 Tag (mit
   Observability Plus 30 Tage). Die interne Speicherdauer bei Vercel (Sicherheit, Abrechnung) ist nicht
   dokumentiert gefunden → bei Vercel erfragen oder im Text allgemein fassen. Formulierung im Entwurf bewusst als
   Platzhalter.
6. **Drittlandübermittlung:** Vercel gibt an, nach dem EU-US Data Privacy Framework zertifiziert zu sein, und
   nennt im DPA zusätzlich die EU-Standardvertragsklauseln (Beschluss 2021/914). **Eintrag in der offiziellen
   DPF-Liste (dataprivacyframework.gov) vor Übernahme prüfen** – hier nicht abgerufen. Rechtsstand: Das EuG hat
   die Klage Latombe gegen den Angemessenheitsbeschluss am 03.09.2025 abgewiesen; das Rechtsmittel beim EuGH
   (eingelegt 31.10.2025) ist nach den gefundenen Quellen anhängig, der Beschluss gilt bis zu einer Entscheidung
   fort. [Aktenzeichen und aktueller Stand vor Freigabe prüfen.]
7. **Google Translate:** Unverändert übernommen. Ob die Einwilligung durch das Aktivieren ausreicht oder ein
   Hinweis vor dem Laden nötig ist, war schon bisher Abstimmungsthema – bitte mitprüfen, da Google Translate
   statisch die einzige Drittübermittlung über das Hosting hinaus ist.
8. **Hobby-Tarif und Nutzungszweck:** Falls der Hobby-Tarif gebucht ist, sind dessen Nutzungsbedingungen
   (Einsatzzweck) für ein Hochschulangebot zu prüfen. [Vercel-Nutzungsbedingungen, nicht abgerufen.]
9. **Zwei Fassungen pflegen?** Solange beide Betriebsarten möglich sind, braucht es zwei Fassungen (Server/
   statisch). Vorschlag: Weiche in der App (F), die die passende Fassung zeigt. Entscheidung, ob die
   Server-Fassung überhaupt noch veröffentlicht wird.
10. **Kanonische Adresse:** Gilt dieselbe Erklärung für baustoffboard.de, sobald diese Adresse auf Vercel zeigt?
    Bei anderer Bereitstellung (z. B. THA-Server, `docs/entwuerfe/anfrage-tha-it-hosting.md`) ist Abschnitt 2
    erneut anzupassen.

---

## E. Impressum

Keine Pflichtänderung durch den statischen Betrieb erkennbar: Das Impressum (`src/modules/Impressum.tsx`) nennt
keinen Hoster und keine Server-Funktionen. Die Drittkomponenten-Tabelle kennzeichnet reine Server-Komponenten
bereits mit „(nur Server)“; statisch werden sie nicht ausgeliefert – Hinweis „(im statischen Betrieb nicht
verwendet)“ optional, Entscheidung beim Verantwortlichen.

---

## F. Technische Umsetzung nach Freigabe (Vorschlag, nicht umgesetzt)

Die Datenschutzerklärung kommt **nicht** aus `content/`, sondern ist fest in `src/modules/Datenschutz.tsx`
geschrieben. Eine Weiche wurde deshalb in diesem Stand **nicht** vorbereitet (Auftrag: nur, wenn trivial und
ohne Textänderung live). Vorschlag für die Umsetzung nach DSB-Freigabe:

- In `src/modules/Datenschutz.tsx` mit `STATISCH` aus `src/data/betriebsart.ts` die Abschnitte wählen
  (Abschnitt 2 Vercel/Cloud Run; 4 und 5 nur mit `SERVER_FUNKTIONEN`; Cookie-Satz `GAESA` nur mit Server).
- In `src/data/speicherRegister.ts` je Eintrag ein Feld `nurServer: true` für `bb_kurzfragebogen`,
  `bb_quiz_freigabe`, `bb_admin_token`, `tha_admin_authenticated`, `bb_voter`; die Tabelle filtert im
  Statik-Modus. `tests/speicherRegister.test.ts` bleibt gültig (prüft nur Vollständigkeit).
- Regressionstest in `tests/statikModus.test.ts`: Statische Fassung enthält weder „Cloud Run“ noch „GAESA“.

---

## Quellen (abgerufen 02.11.2026)

- Vercel, „Is Vercel certified under DPF?“ – https://vercel.com/kb/guide/is-vercel-certified-under-dpf
  („Vercel is certified under the EU-U.S. Data Privacy Framework“; DPA; SCCs und UK Addendum)
- Vercel, Data Processing Addendum, „Last Updated March 17, 2026“ – https://vercel.com/legal/dpa
  (Geltung für Pro und Enterprise; Vercel als Processor für Customer Data, als Controller für Service-Generated
  Data; SCC 2021/914; Unterauftragsverarbeiter: security.vercel.com)
- Vercel, „Runtime Logs“ (last_updated 28.08.2026) – https://vercel.com/docs/runtime-logs
  (Felder je Anfrage, IP-/User-Agent-Abgleich, Aufbewahrung je Tarif, statische Anfragen)
- WilmerHale, „European Court of Justice to Review Challenge to EU-U.S. Data Privacy Framework“ (01.12.2025) –
  https://www.wilmerhale.com/en/insights/blogs/wilmerhale-privacy-and-cybersecurity-law/20251201-european-court-of-justice-to-review-challenge-to-eu-us-data-privacy-framework
  (EuG 03.09.2025 Klage abgewiesen; Rechtsmittel 31.10.2025)
- Captain Compliance, „Latombe Pleas in EU-US Data Privacy Framework Appeal Published in EU Official Journal“
  (29.12.2025) – https://captaincompliance.com/?p=10750 (Rechtsmittel anhängig, DPF gilt fort)
- Live-Seite https://babo-zeta.vercel.app/ (Header von `/`, `/modul/datenschutz`, `/api/health`), 02.11.2026
