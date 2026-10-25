# Ablauf: offene Lizenz für das BaustoffBoard (AP 6.8)

Ziel: **Inhalte CC BY-SA 4.0, Code MIT**, Release mit DOI über Zenodo, Meldung als OER in Bayern und bei twillo.
Stand der Vorbereitung: alles liegt bereit, aber **inaktiv** (`LIZENZ_AKTIV = false` in `src/data/lizenz.ts`,
Lizenzdateien als Entwurf in `docs/lizenz-entwurf/`). Material Dritter: `docs/lizenz-inventur.md`.

> **Keine Rechtsberatung.** Die rechtlichen Hinweise hier fassen den Stand der Recherche zusammen. Verbindlich
> sind die Auskünfte der THA (Justiziariat) und die Lizenztexte selbst.

## A. Klärung mit der THA (Prof. Huber)

1. **Rechteinhaberschaft klären** – Ansprechpartner: Justiziariat der THA, ggf. Hochschulleitung (Vizepräsident/in
   Lehre) und Bibliothek (Open Access/OER).
   - Rechtsgrundlage: **Art. 18 BayHIG** („Diensterfindungen“): Satz 1–2 ordnen Schutzrechte an
     Diensterfindungen der Hochschule zu, **Satz 3** erstreckt dies entsprechend auf „vermögensrechtliche
     Befugnisse gemäß dem Urheberrechtsgesetz“. Dazu **§ 69b UrhG** (Computerprogramme im Dienstverhältnis)
     und **§ 43 UrhG** (Werke in Arbeits-/Dienstverhältnissen). Für Lehrmaterial von Professorinnen und
     Professoren wird wegen der Lehrfreiheit meist angenommen, dass die Rechte beim Urheber bleiben – für
     Software ist das weniger eindeutig.
   - Zu klärende Fragen:
     a) Wer ist Rechteinhaber am **Code** (Prof. Huber, THA oder beide)? Wer steht in der MIT-Copyright-Zeile?
     b) Wer ist Rechteinhaber an den **Lehrinhalten**? Darf Prof. Huber sie selbst unter CC BY-SA 4.0 stellen?
     c) Stammen Teile aus Projekten mit Drittmitteln (Förderbedingungen zu OER/Open Source? Förderkennzeichen
        für `.zenodo.json` → `grants`)?
     d) Haben weitere Personen (Mitarbeitende, Studierende, Kolleginnen/Kollegen) beigetragen, deren
        Zustimmung nötig ist?
     e) Ist die OER-Veröffentlichung mit einer Hochschul-OER-Policy vereinbar bzw. vorgeschrieben?
   - Ergebnis schriftlich festhalten (E-Mail/Vermerk der THA genügt als Nachweis; Ablage außerhalb des Repos).
2. **Inventur-Ergebnisse entscheiden** (`docs/lizenz-inventur.md`):
   - Ausnahmen für Normtabellen bestätigen oder Tabellen ersetzen (z. B. auf Einzelwerte mit Normverweis kürzen).
   - Wortlaut der Definition „Nachhaltiges Bauen“ (Modul Nachhaltigkeit/Definitionen) gegen DIN EN 15643 und
     den BMWSB-Leitfaden prüfen; LAGA PN 98 einordnen lassen.
3. **Freigabe** der Lizenzentwürfe (`docs/lizenz-entwurf/*`) und des Lizenzhinweistextes
   (`LIZENZ_AUSNAHMEN`, `IMPRESSUM_URHEBERRECHT_OFFEN` in `src/data/lizenzTexte.ts`) durch die THA einholen.
4. **ORCID** von Prof. Huber bereitstellen (für `CITATION.cff` und `.zenodo.json`).

## B. Umschalten im Repository (Entwicklung, ein PR)

5. `public/fonts/OFL.txt` anlegen: Lizenztext `LICENSE.txt` aus dem Inter-Repository (rsms/inter) unverändert
   übernehmen (fehlt derzeit – unabhängig von der Projektlizenz nachholen).
6. Dateien ins Wurzelverzeichnis verschieben und Entwurfskommentare entfernen:
   - `docs/lizenz-entwurf/LICENSE.md` → `LICENSE` (ohne Endung, nur der reine MIT-Text; Copyright-Zeile mit
     dem Ergebnis aus Schritt 1a),
   - `docs/lizenz-entwurf/LICENSE-CONTENT.md` → `LICENSE-CONTENT.md`,
   - `docs/lizenz-entwurf/CITATION.cff` → `CITATION.cff` (ORCID, Version, `date-released` eintragen),
   - `docs/lizenz-entwurf/.zenodo.json` → `.zenodo.json` (ORCID eintragen, `notes`-Entwurfssatz entfernen;
     ungültige Werte lassen den Zenodo-Import scheitern).
7. `LIZENZ_AKTIV = true` in `src/data/lizenz.ts`. Dann erscheinen der Lizenzhinweis in der Fußzeile jeder
   Seite (`LicenseNotice`) und der offene Urheberrechtsabsatz im Impressum.
8. Tests anpassen: In `tests/lizenz.test.ts` die Erwartung „Schalter steht auf false“ umkehren; der Dateitest
   prüft dann automatisch die Dateien im Wurzelverzeichnis.
9. Optional: `"license": "(MIT AND CC-BY-SA-4.0)"` in `package.json` (in AP 6.8 bewusst nicht geändert) und
   README-Abschnitt „Lizenz“.
10. QA wie üblich (`npm run lint`, `npm test`, Build, `check-bundle`, `check-verwaist --strict`), mergen.

## C. Release mit DOI (Zenodo)

Voraussetzung: Repository `juhu-tha/babo` ist **öffentlich** (derzeit privat). Vorher die Git-Historie auf
Zugangsdaten prüfen (z. B. mit `gitleaks`), da die gesamte Historie sichtbar wird.

11. Bei Zenodo (<https://zenodo.org>) mit dem GitHub-Konto anmelden bzw. das GitHub-Konto verknüpfen
    (Zenodo → Profil → GitHub), dort das Repository `juhu-tha/babo` einschalten. Bei einer Organisation muss
    die Zenodo-App für `juhu-tha` freigegeben sein.
12. Auf GitHub ein **Release** erstellen (Tag `v4.3.0` o. ä.). Zenodo archiviert den Stand automatisch und
    vergibt eine **Versions-DOI** sowie eine **Konzept-DOI** für alle Versionen. Metadaten kommen aus
    `.zenodo.json` (hat Vorrang vor `CITATION.cff`, siehe Zenodo-Hilfe
    <https://help.zenodo.org/docs/github/describe-software/zenodo-json>).
13. Konzept-DOI in `CITATION.cff` (`identifiers`), README und – falls gewünscht – in der Namensnennung
    (`NAMENSNENNUNG` in `src/data/lizenzTexte.ts`) eintragen; DOI-Badge im README.
14. Drittlizenzen dem Release beilegen (Apache-2.0 von `xlsx`/`@google/genai` verlangt den Erhalt der
    Lizenzhinweise): Liste der Abhängigkeiten mit Lizenzen als `THIRD-PARTY-LICENSES.txt` erzeugen.
15. Optional: Zenodo-Community (z. B. der THA, falls vorhanden) in `.zenodo.json` → `communities`.

## D. Meldung als OER

16. **OER@vhb – OER-Repositorium der Virtuellen Hochschule Bayern** (<https://oer.vhb.org>) – für Material
    bayerischer Hochschulen; auf Edu-Sharing-Basis, in OERSI indexiert. Eintrag mit Titel, Beschreibung,
    Lizenz CC BY-SA 4.0, Link auf <https://www.baustoffboard.de> und auf die Zenodo-DOI. Ansprechpartner:
    Geschäftsstelle der vhb; zuvor bei der THA (Lehrentwicklung/E-Learning) nachfragen, ob die THA einen
    Zugang/Ansprechpartner hat.
    – *Hinweis:* **mebis** ist die Lernplattform der bayerischen *Schulen* (heute Teil der ByCS) und für
    Hochschulmaterial nicht zuständig; ein eigenständiges „OER-Hub Bayern“ für Hochschulen wurde nicht
    gefunden – maßgeblich ist OER@vhb. (Daneben bietet OPEN vhb, <https://open.vhb.org>, offene Online-Kurse;
    für eine Lernplattform wie das BaustoffBoard nicht der passende Weg.)
17. **twillo** (<https://www.twillo.de>) – OER-Portal, betrieben von der TIB Hannover, gefördert vom
    niedersächsischen Wissenschaftsministerium; Anmeldung für Hochschulangehörige über DFN-AAI. Ob Lehrende
    außerhalb Niedersachsens Material hochladen dürfen, ließ sich aus öffentlichen Quellen nicht sicher klären
    → **offen**; ggf. beim twillo-Support erfragen (Entwicklung, nicht Prof. Huber). Falls nicht möglich,
    genügt die Auffindbarkeit über OERSI (Schritt 18), die twillo-Inhalte ebenfalls einschließt.
18. **OERSI** (OER Search Index, <https://oersi.org>) – sammelt OER aus OER@vhb, twillo u. a. automatisch.
    Zusätzlich direkt auffindbar machen: `metadata.yml` mit dem OERSI-Metadatengenerator erzeugen, ins
    Repository legen, OER-Topic nach OERSI-Dokumentation setzen (für GitLab „Open Educational Ressources“;
    für GitHub vor dem Setzen in der OERSI-Doku nachsehen), Repository öffentlich,
    `creativeWorkStatus: Published` (Ablauf wie bei HIFIS beschrieben:
    <https://hifis.net/doc/software/gitlab/oersi>).

## Quellen (Recherche 25.10.2026)

- Art. 18 BayHIG: <https://lexmea.de/de/gesetz/bayhig/art-18>; Artikelübersicht:
  <https://www.umwelt-online.de/recht/allgemei/laender/bay/bayhig_in.htm>
- CC BY-SA 4.0 (Deed und deutscher Rechtstext): <https://creativecommons.org/licenses/by-sa/4.0/deed.de>
- Zenodo `.zenodo.json`: <https://help.zenodo.org/docs/github/describe-software/zenodo-json>; GitHub-Ablauf:
  <https://data.research.cornell.edu/?p=2445>
- vhb-Angebote einschl. OER@vhb: <https://www.bayernportal.de/dokumente/leistung/977646873426>;
  OPEN vhb & vhb Edu-Sharing in OERSI: <https://oersi.org/pages/de/blog/2022/04/24/open-vhb-vhb-edusharing>
- twillo: <https://pretalx.com/open-education-day-2024/talk/BRAHLC/>,
  <https://www.l3s.de/magazine/binaire-articles/sharing-digital-education-with-twillo>
